"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = require("../prisma.js");
const asyncHandler_js_1 = require("../middlewares/asyncHandler.js");
const auth_js_1 = require("../middlewares/auth.js");
const email_js_1 = require("../utils/email.js");
const helpers_js_1 = require("../utils/helpers.js");
const redis_js_1 = require("../utils/redis.js");
const router = (0, express_1.Router)();
const LEAD_STATUSES = ['new', 'contacted', 'in_progress', 'closed'];
// ─── CACHE HELPERS (diperbaiki untuk UUID string) ──────────────────────
function getCacheKeyForList(params) {
    const { page = 1, limit = 10, status } = params;
    return `leads:list:page:${page}:limit:${limit}:status:${status || 'all'}`;
}
// ✅ id sekarang string (UUID)
function getCacheKeyForSingle(id) {
    return `leads:${id}`;
}
// ✅ id opsional bertipe string
async function invalidateLeadCache(id) {
    try {
        const listKeys = await redis_js_1.redis.keys('leads:list:*');
        if (listKeys.length > 0) {
            await redis_js_1.redis.del(...listKeys);
        }
        if (id) {
            const singleKey = getCacheKeyForSingle(id);
            await redis_js_1.redis.del(singleKey);
        }
    }
    catch (error) {
        console.error('❌ Redis cache invalidation error:', error);
    }
}
// ─── PUBLIC: POST /api/leads (tidak perlu auth) ────────────────────────
router.post('/', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { full_name, company, phone, email, message } = req.body;
    if (!full_name || !email || !phone || !message) {
        return res.status(400).json({
            success: false,
            message: 'Full name, email, phone, and message are required',
        });
    }
    const normalizedEmail = (0, helpers_js_1.normalizeEmail)(email);
    const normalizedName = (0, helpers_js_1.normalizeString)(full_name, 'Full name');
    const normalizedPhone = (0, helpers_js_1.normalizeString)(phone, 'Phone');
    const normalizedMessage = (0, helpers_js_1.normalizeString)(message, 'Message');
    const lead = await prisma_js_1.prisma.leads.create({
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
    await (0, email_js_1.sendLeadNotificationEmail)({
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
}));
// ─── PROTECTED ROUTES (memerlukan autentikasi) ──────────────────────────
const protectedRouter = (0, express_1.Router)();
protectedRouter.use(auth_js_1.authenticate);
// GET /api/leads (list with pagination)
protectedRouter.get('/', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status || undefined;
    const skip = (page - 1) * limit;
    const cacheKey = getCacheKeyForList({ page, limit, status });
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({
            success: true,
            fromCache: true,
            ...JSON.parse(cached),
        });
    }
    const where = {};
    if (status && status !== 'all') {
        where.status = status;
    }
    const [leads, total] = await Promise.all([
        prisma_js_1.prisma.leads.findMany({
            where,
            orderBy: { created_at: 'desc' },
            skip,
            take: limit,
        }),
        prisma_js_1.prisma.leads.count({ where }),
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
    await redis_js_1.redis.setex(cacheKey, 60, JSON.stringify(result));
    res.json({
        success: true,
        fromCache: false,
        ...result,
    });
}));
// GET /api/leads/:id (detail)
protectedRouter.get('/:id', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const cacheKey = getCacheKeyForSingle(id);
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({
            success: true,
            fromCache: true,
            data: JSON.parse(cached),
        });
    }
    const lead = await prisma_js_1.prisma.leads.findUnique({
        where: { id },
    });
    if (!lead) {
        return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
    }
    await redis_js_1.redis.setex(cacheKey, 60, JSON.stringify(lead));
    res.json({
        success: true,
        fromCache: false,
        data: lead,
    });
}));
// PUT /api/leads/:id (update)
protectedRouter.put('/:id', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const { full_name, company, phone, email, message, status } = req.body;
    const existing = await prisma_js_1.prisma.leads.findUnique({ where: { id } });
    if (!existing) {
        return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
    }
    if (status !== undefined && !LEAD_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Status tidak valid. Gunakan salah satu: ${LEAD_STATUSES.join(', ')}`,
        });
    }
    const updateData = {};
    if (full_name !== undefined)
        updateData.full_name = (0, helpers_js_1.normalizeString)(full_name, 'Full name');
    if (company !== undefined)
        updateData.company = company || null;
    if (phone !== undefined)
        updateData.phone = (0, helpers_js_1.normalizeString)(phone, 'Phone');
    if (email !== undefined)
        updateData.email = (0, helpers_js_1.normalizeEmail)(email);
    if (message !== undefined)
        updateData.message = (0, helpers_js_1.normalizeString)(message, 'Message');
    if (status !== undefined)
        updateData.status = status;
    const updatedLead = await prisma_js_1.prisma.leads.update({
        where: { id },
        data: updateData,
    });
    await invalidateLeadCache(id);
    res.json({
        success: true,
        message: 'Lead berhasil diperbarui',
        data: updatedLead,
    });
}));
// DELETE /api/leads/:id
protectedRouter.delete('/:id', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const existing = await prisma_js_1.prisma.leads.findUnique({ where: { id } });
    if (!existing) {
        return res.status(404).json({ success: false, message: 'Lead tidak ditemukan' });
    }
    await prisma_js_1.prisma.leads.delete({ where: { id } });
    await invalidateLeadCache(id);
    res.json({
        success: true,
        message: 'Lead berhasil dihapus',
    });
}));
router.use('/', protectedRouter);
exports.default = router;
