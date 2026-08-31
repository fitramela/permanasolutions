"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = require("../prisma.js");
const asyncHandler_js_1 = require("../middlewares/asyncHandler.js");
const auth_js_1 = require("../middlewares/auth.js");
const redis_js_1 = require("../utils/redis.js");
const helpers_js_1 = require("../utils/helpers.js"); // ✅ tambahan
const router = (0, express_1.Router)();
const CACHE_TTL = 60;
function getPageCacheKey(slug, locale) {
    return `cms:page:${slug}:${locale}`;
}
function getMasterCacheKey(type, locale) {
    return locale ? `cms:master:${type}:${locale}` : `cms:master:${type}`;
}
function getSettingsCacheKey() {
    return 'cms:settings';
}
async function invalidatePageCache() {
    try {
        const keys = await redis_js_1.redis.keys('cms:page:*');
        if (keys.length)
            await redis_js_1.redis.del(...keys);
    }
    catch (error) {
        console.error('Invalidate page cache error:', error);
    }
}
async function invalidateMasterCache(type) {
    try {
        const keys = await redis_js_1.redis.keys(`cms:master:${type}*`);
        if (keys.length)
            await redis_js_1.redis.del(...keys);
    }
    catch (error) {
        console.error('Invalidate master cache error:', error);
    }
}
async function invalidateSettingsCache() {
    try {
        await redis_js_1.redis.del(getSettingsCacheKey());
    }
    catch (error) {
        console.error('Invalidate settings cache error:', error);
    }
}
const pageTitle = {
    home: 'Beranda',
    solutions: 'Solusi',
    about: 'Tentang Kami',
    contact: 'Kontak',
    asp: 'ASP',
    isp: 'ISP',
    resource: 'Consulting & Resource',
    global: 'Global',
};
const servicePageTypes = ['asp', 'isp', 'resource'];
function resolvePageType(slug) {
    if (slug === 'global')
        return 'global';
    if (servicePageTypes.includes(slug))
        return 'service';
    return 'page';
}
const masters = {
    products: {
        model: 'products',
        allowed: [
            'name',
            'slug',
            'service',
            'category',
            'locale',
            'description',
            'image_url',
            'meta',
            'sort_order',
            'is_active',
        ],
    },
    clients: {
        model: 'clients',
        allowed: ['name', 'industry', 'logo_url', 'placement', 'locale', 'sort_order', 'is_active'],
    },
    technologies: {
        model: 'technologies',
        allowed: ['name', 'category', 'logo_url', 'locale', 'sort_order', 'is_active'],
    },
    team: {
        model: 'team_members',
        allowed: ['name', 'position', 'bio', 'photo_url', 'linkedin_url', 'locale', 'sort_order', 'is_active'],
    },
};
function master(type) {
    const config = masters[type];
    if (!config)
        throw Object.assign(new Error('Master type tidak ditemukan'), { statusCode: 404 });
    return config;
}
function pick(body, allowed) {
    return Object.fromEntries(allowed.filter((k) => body?.[k] !== undefined).map((k) => [k, body[k]]));
}
// ─── PUBLIC ROUTES ──────────────────────────────────────────────────────────
router.get('/pages/:slug', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const locale = req.query.locale || 'id';
    const cacheKey = getPageCacheKey(slug, locale);
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }
    const page = await prisma_js_1.prisma.cms_pages.findFirst({
        where: { slug, locale, status: 'published' },
        include: {
            sections: {
                where: { is_active: true },
                orderBy: { sort_order: 'asc' },
            },
        },
    });
    await redis_js_1.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(page));
    res.json({ success: true, fromCache: false, data: page });
}));
router.get('/master/:type', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const type = req.params.type;
    const locale = req.query.locale;
    const config = master(type);
    const cacheKey = getMasterCacheKey(type, locale);
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }
    const model = prisma_js_1.prisma[config.model];
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
router.get('/settings', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const cacheKey = getSettingsCacheKey();
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }
    const rows = await prisma_js_1.prisma.site_settings.findMany();
    const data = Object.fromEntries(rows.map((row) => [row.setting_key, row.value]));
    await redis_js_1.redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
    res.json({ success: true, fromCache: false, data });
}));
// ─── PROTECTED ROUTES ──────────────────────────────────────────────────────
const protectedRouter = (0, express_1.Router)();
protectedRouter.use(auth_js_1.authenticate);
protectedRouter.put('/pages/:slug/sections/:sectionKey', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const sectionKey = req.params.sectionKey;
    const locale = req.body.locale || 'id';
    const { title, content = {}, is_active = true, sort_order = 0 } = req.body ?? {};
    const page = await prisma_js_1.prisma.cms_pages.upsert({
        where: { slug_locale: { slug, locale } },
        create: {
            slug,
            locale,
            title: pageTitle[slug] ?? slug,
            page_type: resolvePageType(slug),
            status: 'published',
        },
        update: {},
    });
    const section = await prisma_js_1.prisma.cms_sections.upsert({
        where: {
            page_id_section_key_locale: { page_id: page.id, section_key: sectionKey, locale },
        },
        create: {
            page_id: page.id,
            section_key: sectionKey,
            locale,
            title: title ?? sectionKey,
            content,
            is_active,
            sort_order,
        },
        update: { title: title ?? sectionKey, content, is_active, sort_order },
    });
    await invalidatePageCache();
    res.json({ success: true, data: section });
}));
protectedRouter.delete('/pages/:slug/sections/:sectionKey', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const sectionKey = req.params.sectionKey;
    const locale = req.query.locale || 'id';
    const page = await prisma_js_1.prisma.cms_pages.findUnique({ where: { slug_locale: { slug, locale } } });
    if (!page) {
        return res.status(404).json({ success: false, message: 'Page tidak ditemukan' });
    }
    await prisma_js_1.prisma.cms_sections.delete({
        where: { page_id_section_key_locale: { page_id: page.id, section_key: sectionKey, locale } },
    });
    await invalidatePageCache();
    res.json({ success: true });
}));
protectedRouter.put('/pages/:slug/meta', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const locale = req.body.locale || 'id';
    const { meta_title = null, meta_description = null, status = 'published' } = req.body ?? {};
    const page = await prisma_js_1.prisma.cms_pages.upsert({
        where: { slug_locale: { slug, locale } },
        create: {
            slug,
            locale,
            title: pageTitle[slug] ?? slug,
            page_type: resolvePageType(slug),
            meta_title,
            meta_description,
            status,
        },
        update: { meta_title, meta_description, status },
    });
    await invalidatePageCache();
    res.json({ success: true, data: page });
}));
protectedRouter.post('/master/:type', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const type = req.params.type;
    const config = master(type);
    const model = prisma_js_1.prisma[config.model];
    const data = await model.create({ data: pick(req.body, config.allowed) });
    await invalidateMasterCache(type);
    res.status(201).json({ success: true, data });
}));
// ✅ Perbaikan: id sekarang UUID (string), bukan number
protectedRouter.put('/master/:type/:id', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const type = req.params.type;
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const config = master(type);
    const model = prisma_js_1.prisma[config.model];
    const data = await model.update({
        where: { id },
        data: pick(req.body, config.allowed),
    });
    await invalidateMasterCache(type);
    res.json({ success: true, data });
}));
// ✅ Perbaikan: id sekarang UUID (string), bukan number
protectedRouter.delete('/master/:type/:id', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const type = req.params.type;
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const config = master(type);
    const model = prisma_js_1.prisma[config.model];
    await model.delete({ where: { id } });
    await invalidateMasterCache(type);
    res.json({ success: true });
}));
protectedRouter.put('/settings/:key', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const key = req.params.key;
    const value = req.body?.value ?? {};
    const data = await prisma_js_1.prisma.site_settings.upsert({
        where: { setting_key: key },
        create: { setting_key: key, value },
        update: { value },
    });
    await invalidateSettingsCache();
    res.json({ success: true, data });
}));
router.use('/', protectedRouter);
exports.default = router;
