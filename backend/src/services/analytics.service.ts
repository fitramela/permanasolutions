/**
 * services/analytics.service.ts
 *
 * Logika bisnis untuk pelacakan visitor & page view.
 */

import crypto from 'node:crypto';
import { prisma } from '../prisma.js';
import { analyticsRepo } from '../repositories/analytics.repository.js';
import { AppError } from '../middlewares/errorHandler.js';
import { cache } from '../utils/cache.js';
function hmac(value: string): string {
  const secret = process.env.ANALYTICS_SECRET || process.env.JWT_SECRET || 'analytics-fallback-secret';
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export const analyticsService = {
  async track(input: {
    visitorId: string;
    sessionId: string;
    path: string;
    locale: string | null;
    referrer: string | null;
    userAgent: string;
    rawIp: string;
  }) {
    const { visitorId, sessionId, path, locale, referrer, userAgent, rawIp } = input;

    // Rate limit per session: satu tracking per 10 detik
    const rateLimitKey = `track:session:${sessionId}`;
    const isNew = await cache.get(rateLimitKey);
    if (isNew !== null) {
      throw new AppError('Too many tracking requests', 429);
    }
    // Simpan marker selama 10 detik (tidak pakai cache.set agar tidak JSON.stringify)
    const { redis } = await import('../utils/redis.js');
    await redis.set(rateLimitKey, '1', 'EX', 10, 'NX');

    const ipHash = rawIp ? hmac(rawIp) : null;
    const networkAgentHash = rawIp || userAgent ? hmac(`${rawIp}|${userAgent}`) : null;
    const now = new Date();

    // Semua operasi dalam satu transaksi
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
        data: {
          visitor_id: visitorId,
          session_id: sessionId,
          path,
          locale,
          referrer,
          viewed_at: now,
        },
      });
    });
  },
};
