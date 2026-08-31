import { Router } from 'express';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/auth.js';
import { sendLeadNotificationEmail } from '../utils/email.js';
import { normalizeEmail, normalizeString, normalizeUuid } from '../utils/helpers.js';
import { redis } from '../utils/redis.js';

const router = Router();

const LEAD_STATUSES = ['new', 'contacted', 'in_progress', 'closed'];

// ─── CACHE HELPERS (diperbaiki untuk UUID string) ──────────────────────

function getCacheKeyForList(params: any): string {
  const { page = 1, limit = 10, status } = params;
  return `leads:list:page:${page}:limit:${limit}:status:${status || 'all'}`;
}

// ✅ id sekarang string (UUID)
function getCacheKeyForSingle(id: string): string {
  return `leads:${id}`;
}

// ✅ id opsional bertipe string
async function invalidateLeadCache(id?: string): Promise<void> {
  try {
    const listKeys = await redis.keys('leads:list:*');
    if (listKeys.length > 0) {
      await redis.del(...listKeys);
    }
    if (id) {
      const singleKey = getCacheKeyForSingle(id);
      await redis.del(singleKey);
    }
  } catch (error) {
    console.error('❌ Redis cache invalidation error:', error);
  }
}

// ─── PUBLIC: POST /api/leads (tidak perlu auth) ────────────────────────

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { full_name, company, phone, email, message } = req.body;

    if (!full_name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, phone, and message are required',
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedName = normalizeString(full_name, 'Full name');
    const normalizedPhone = normalizeString(phone, 'Phone');
    const normalizedMessage = normalizeString(message, 'Message');

    const lead = await prisma.leads.create({
      data: {
        full_name: normalizedName,
        company: company || null,
        phone: normalizedPhone,
        email: normalizedEmail,
        message: normalizedMessage,
        status: 'new',
        source: 'website',
      },
    });

    await sendLeadNotificationEmail({
      full_name: normalizedName,
      company: company || '-',
      phone: normalizedPhone,
      email: normalizedEmail,
      message: normalizedMessage,
    });

    await invalidateLeadCache();

    res.status(201).json({
      success: true,
      message: 'Lead berhasil dikirim. Tim kami akan menghubungi Anda.',
      data: {
        id: lead.id, // string (UUID)
        full_name: lead.full_name,
        email: lead.email,
      },
    });
  })
);

// ─── PROTECTED ROUTES (memerlukan autentikasi) ──────────────────────────

const protectedRouter = Router();
protectedRouter.use(authenticate);

// GET /api/leads (list with pagination)
protectedRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = (req.query.status as string) || undefined;
    const skip = (page - 1) * limit;

    const cacheKey = getCacheKeyForList({ page, limit, status });
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        fromCache: true,
        ...JSON.parse(cached),
      });
    }

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const [leads, total] = await Promise.all([
      prisma.leads.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.leads.count({ where }),
    ]);

    const result = {
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await redis.setex(cacheKey, 60, JSON.stringify(result));

    res.json({
      success: true,
      fromCache: false,
      ...result,
    });
  })
);

// GET /api/leads/:id (detail)
protectedRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const cacheKey = getCacheKeyForSingle(id);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const lead = await prisma.leads.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
    }

    await redis.setex(cacheKey, 60, JSON.stringify(lead));

    res.json({
      success: true,
      fromCache: false,
      data: lead,
    });
  })
);

// PUT /api/leads/:id (update)
protectedRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { full_name, company, phone, email, message, status } = req.body;

    const existing = await prisma.leads.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
    }

    if (status !== undefined && !LEAD_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status tidak valid. Gunakan salah satu: ${LEAD_STATUSES.join(', ')}`,
      });
    }

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = normalizeString(full_name, 'Full name');
    if (company !== undefined) updateData.company = company || null;
    if (phone !== undefined) updateData.phone = normalizeString(phone, 'Phone');
    if (email !== undefined) updateData.email = normalizeEmail(email);
    if (message !== undefined) updateData.message = normalizeString(message, 'Message');
    if (status !== undefined) updateData.status = status;

    const updatedLead = await prisma.leads.update({
      where: { id },
      data: updateData,
    });

    await invalidateLeadCache(id);

    res.json({
      success: true,
      message: 'Lead berhasil diperbarui',
      data: updatedLead,
    });
  })
);

// DELETE /api/leads/:id
protectedRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const existing = await prisma.leads.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
    }

    await prisma.leads.delete({ where: { id } });

    await invalidateLeadCache(id);

    res.json({
      success: true,
      message: 'Lead berhasil dihapus',
    });
  })
);

router.use('/', protectedRouter);

export default router;