"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = require("../prisma.js");
const asyncHandler_js_1 = require("../middlewares/asyncHandler.js");
const redis_js_1 = require("../utils/redis.js");
const router = (0, express_1.Router)();
const CACHE_TTL = 60;
function getPageCacheKey(slug, locale) {
    return `cms:page:${slug}:${locale}`;
}
function getMasterCacheKey(type, locale) {
    return locale ? `cms:master:${type}:${locale}` : `cms:master:${type}`;
}
router.get('/pages/:slug', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const locale = req.query.locale || 'id';
    const cacheKey = getPageCacheKey(slug, locale);
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }
    const data = await prisma_js_1.prisma.cms_pages.findFirst({
        where: { slug, locale, status: 'published' },
        include: {
            sections: {
                where: { is_active: true },
                orderBy: { sort_order: 'asc' },
            },
        },
    });
    await redis_js_1.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
    res.json({ success: true, fromCache: false, data });
}));
const models = {
    products: 'products',
    clients: 'clients',
    technologies: 'technologies',
    team: 'team_members',
};
router.get('/master/:type', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const type = req.params.type;
    const locale = req.query.locale;
    const modelName = models[type];
    if (!modelName) {
        return res.status(404).json({ success: false, message: 'Type tidak ditemukan' });
    }
    const cacheKey = getMasterCacheKey(type, locale);
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }
    const model = prisma_js_1.prisma[modelName];
    const where = { is_active: true };
    if (locale)
        where.locale = locale;
    const data = await model.findMany({
        where,
        orderBy: [{ sort_order: 'asc' }, { id: 'desc' }],
    });
    await redis_js_1.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
    res.json({ success: true, fromCache: false, data });
}));
router.get('/products/:slug/features', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const locale = req.query.locale || 'id';
    const cacheKey = `cms:product-features:${slug}:${locale}`;
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }
    const product = await prisma_js_1.prisma.products.findFirst({
        where: { slug, locale, is_active: true },
        include: {
            features: {
                where: { is_active: true },
                orderBy: { sort_order: 'asc' },
            },
        },
    });
    if (!product) {
        return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
    await redis_js_1.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(product));
    res.json({ success: true, fromCache: false, data: product });
}));
exports.default = router;
