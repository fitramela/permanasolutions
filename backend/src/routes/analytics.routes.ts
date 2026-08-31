import { Router } from 'express';
import crypto from 'node:crypto';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/auth.js';
import { redis } from '../utils/redis.js';

const router = Router();

function clean(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : null;
}

function getClientIp(req: any) {
  const forwarded = clean(req.headers['x-forwarded-for'], 500);
  if (forwarded) return forwarded.split(',')[0]?.trim() || '';
  return req.ip || req.socket?.remoteAddress || '';
}

function analyticsSecret() {
  return process.env.ANALYTICS_SECRET || process.env.JWT_SECRET || 'permana-local-analytics-secret';
}

function hmac(value: string) {
  return crypto.createHmac('sha256', analyticsSecret()).update(value).digest('hex');
}
router.post(
  '/',
  // authenticate, 
  asyncHandler(async (req, res) => {
    const visitorId = clean(req.body?.visitorId, 64);
    const sessionId = clean(req.body?.sessionId, 64);
    const path = clean(req.body?.path, 500);
    const locale = clean(req.body?.locale, 10);
    const referrer = clean(req.body?.referrer, 1000);

    if (!visitorId || !sessionId || !path) {
      return res.status(400).json({ success: false, message: 'Tracking payload tidak lengkap' });
    }

    const rateLimitKey = `track:session:${sessionId}`;
    let isRateLimited = false;

    try {
      const exists = await redis.set(rateLimitKey, '1', 'EX', 10, 'NX');
      if (!exists) {
        isRateLimited = true;
      }
    } catch (error) {
      console.error('❌ Redis rate limit error:', error);
    }

    if (isRateLimited) {
      return res.status(429).json({
        success: false,
        message: 'Too many tracking requests. Please slow down.',
      });
    }

    const userAgent = clean(req.get('user-agent'), 500) || '';
    const rawIp = getClientIp(req);
    const ipHash = rawIp ? hmac(rawIp) : null;
    const networkAgentHash = rawIp || userAgent ? hmac(`${rawIp}|${userAgent}`) : null;
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.visitors.upsert({
        where: { visitor_id: visitorId },
        create: { visitor_id: visitorId, first_seen_at: now, last_seen_at: now },
        update: { last_seen_at: now },
      });

      await tx.visitor_sessions.upsert({
        where: { session_id: sessionId },
        create: {
          visitor_id: visitorId,
          session_id: sessionId,
          ip_hash: ipHash,
          user_agent: userAgent || null,
          network_agent_hash: networkAgentHash,
          referrer,
          started_at: now,
          last_seen_at: now,
        },
        update: {
          last_seen_at: now,
          ip_hash: ipHash,
          user_agent: userAgent || null,
          network_agent_hash: networkAgentHash,
        },
      });

      await tx.page_views.create({
        data: { visitor_id: visitorId, session_id: sessionId, path, locale, referrer, viewed_at: now },
      });
    });

    res.status(201).json({ success: true });
  })
);

export default router;