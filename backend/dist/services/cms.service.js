"use strict";
/**
 * services/cms.service.ts
 *
 * Logika bisnis untuk CMS: pages, sections, master data, dan site settings.
 * Cache read-through dan invalidation dikelola di sini.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmsService = void 0;
const cms_repository_js_1 = require("../repositories/cms.repository.js");
const errorHandler_js_1 = require("../middlewares/errorHandler.js");
const cache_js_1 = require("../utils/cache.js");
const CACHE_TTL = 60;
const CACHE_KEYS = {
    page: (slug, locale) => `cms:page:${slug}:${locale}`,
    master: (type, locale) => locale ? `cms:master:${type}:${locale}` : `cms:master:${type}`,
    settings: () => 'cms:settings',
    productFeatures: (slug, locale) => `cms:product-features:${slug}:${locale}`,
};
async function invalidatePageCache() {
    await cache_js_1.cache.delByPattern('cms:page:*');
}
async function invalidateMasterCache(type) {
    await cache_js_1.cache.delByPattern(`cms:master:${type}*`);
}
async function invalidateProductFeatureCache() {
    await cache_js_1.cache.delByPattern('cms:product-features:*');
    await cache_js_1.cache.delByPattern('cms:master:products*');
}
const PAGE_TITLES = {
    home: 'Beranda',
    solutions: 'Solusi',
    about: 'Tentang Kami',
    contact: 'Kontak',
    asp: 'ASP',
    isp: 'ISP',
    resource: 'Consulting & Resource',
    global: 'Global',
};
const SERVICE_PAGE_SLUGS = new Set(['asp', 'isp', 'resource']);
function resolvePageType(slug) {
    if (slug === 'global')
        return 'global';
    if (SERVICE_PAGE_SLUGS.has(slug))
        return 'service';
    return 'page';
}
function pickAllowedFields(body, allowed) {
    return Object.fromEntries(allowed.filter((key) => key in body && body[key] !== undefined).map((key) => [key, body[key]]));
}
exports.cmsService = {
    async getPage(slug, locale) {
        const key = CACHE_KEYS.page(slug, locale);
        const cached = await cache_js_1.cache.get(key);
        if (cached !== null)
            return { data: cached, fromCache: true };
        const page = await cms_repository_js_1.cmsPageRepo.findPublished(slug, locale);
        await cache_js_1.cache.set(key, page, CACHE_TTL);
        return { data: page, fromCache: false };
    },
    async getMaster(type, locale) {
        if (!(0, cms_repository_js_1.isMasterType)(type))
            throw new errorHandler_js_1.AppError('Tipe master tidak ditemukan', 404);
        const key = CACHE_KEYS.master(type, locale);
        const cached = await cache_js_1.cache.get(key);
        if (cached !== null)
            return { data: cached, fromCache: true };
        const data = await cms_repository_js_1.masterRepo.findActive(type, locale);
        await cache_js_1.cache.set(key, data, CACHE_TTL);
        return { data, fromCache: false };
    },
    async getSettings() {
        const key = CACHE_KEYS.settings();
        const cached = await cache_js_1.cache.get(key);
        if (cached !== null)
            return { data: cached, fromCache: true };
        const rows = await cms_repository_js_1.siteSettingsRepo.findAll();
        const data = Object.fromEntries(rows.map((r) => [r.setting_key, r.value]));
        await cache_js_1.cache.set(key, data, CACHE_TTL);
        return { data, fromCache: false };
    },
    async getProductWithFeatures(slug, locale) {
        const key = CACHE_KEYS.productFeatures(slug, locale);
        const cached = await cache_js_1.cache.get(key);
        if (cached !== null)
            return { data: cached, fromCache: true };
        const { prisma } = await Promise.resolve().then(() => __importStar(require('../prisma.js')));
        const product = await prisma.products.findFirst({
            where: { slug, locale, is_active: true },
            include: {
                features: { where: { is_active: true }, orderBy: { sort_order: 'asc' } },
            },
        });
        if (!product)
            throw new errorHandler_js_1.AppError('Produk tidak ditemukan', 404);
        await cache_js_1.cache.set(key, product, CACHE_TTL);
        return { data: product, fromCache: false };
    },
    async upsertSection(slug, sectionKey, body) {
        const page = await cms_repository_js_1.cmsPageRepo.upsert(slug, body.locale, { title: PAGE_TITLES[slug] ?? slug, page_type: resolvePageType(slug) }, {});
        const section = await cms_repository_js_1.cmsSectionRepo.upsert(page.id, sectionKey, body.locale, {
            title: body.title,
            content: body.content,
            is_active: body.is_active,
            sort_order: body.sort_order,
        });
        await invalidatePageCache();
        return section;
    },
    async deleteSection(slug, sectionKey, locale) {
        const page = await cms_repository_js_1.cmsPageRepo.findBySlugLocale(slug, locale);
        if (!page)
            throw new errorHandler_js_1.AppError('Halaman tidak ditemukan', 404);
        await cms_repository_js_1.cmsSectionRepo.delete(page.id, sectionKey, locale);
        await invalidatePageCache();
    },
    async upsertPageMeta(slug, body) {
        const page = await cms_repository_js_1.cmsPageRepo.upsert(slug, body.locale, {
            title: PAGE_TITLES[slug] ?? slug,
            page_type: resolvePageType(slug),
            meta_title: body.meta_title,
            meta_description: body.meta_description,
            status: body.status,
        }, {
            meta_title: body.meta_title,
            meta_description: body.meta_description,
            status: body.status,
        });
        await invalidatePageCache();
        return page;
    },
    async createMasterItem(type, body) {
        if (!(0, cms_repository_js_1.isMasterType)(type))
            throw new errorHandler_js_1.AppError('Tipe master tidak ditemukan', 404);
        const data = pickAllowedFields(body, cms_repository_js_1.MASTER_ALLOWED_FIELDS[type]);
        const result = await cms_repository_js_1.masterRepo.create(type, data);
        await invalidateMasterCache(type);
        return result;
    },
    async updateMasterItem(type, id, body) {
        if (!(0, cms_repository_js_1.isMasterType)(type))
            throw new errorHandler_js_1.AppError('Tipe master tidak ditemukan', 404);
        const data = pickAllowedFields(body, cms_repository_js_1.MASTER_ALLOWED_FIELDS[type]);
        const result = await cms_repository_js_1.masterRepo.update(type, id, data);
        await invalidateMasterCache(type);
        return result;
    },
    async deleteMasterItem(type, id) {
        if (!(0, cms_repository_js_1.isMasterType)(type))
            throw new errorHandler_js_1.AppError('Tipe master tidak ditemukan', 404);
        await cms_repository_js_1.masterRepo.delete(type, id);
        await invalidateMasterCache(type);
    },
    async updateSetting(key, value) {
        const result = await cms_repository_js_1.siteSettingsRepo.upsert(key, value);
        await cache_js_1.cache.del(CACHE_KEYS.settings());
        return result;
    },
    async getProductFeatures(productId) {
        return cms_repository_js_1.productFeatureRepo.findByProduct(productId);
    },
    async createProductFeature(productId, data) {
        const { prisma } = await Promise.resolve().then(() => __importStar(require('../prisma.js')));
        const product = await prisma.products.findUnique({ where: { id: productId } });
        if (!product)
            throw new errorHandler_js_1.AppError('Produk tidak ditemukan', 404);
        const feature = await cms_repository_js_1.productFeatureRepo.create(productId, data);
        await invalidateProductFeatureCache();
        return feature;
    },
    async updateProductFeature(productId, featureId, data) {
        const existing = await cms_repository_js_1.productFeatureRepo.findOneByProduct(featureId, productId);
        if (!existing)
            throw new errorHandler_js_1.AppError('Fitur tidak ditemukan', 404);
        const feature = await cms_repository_js_1.productFeatureRepo.update(featureId, data);
        await invalidateProductFeatureCache();
        return feature;
    },
    async deleteProductFeature(productId, featureId) {
        const existing = await cms_repository_js_1.productFeatureRepo.findOneByProduct(featureId, productId);
        if (!existing)
            throw new errorHandler_js_1.AppError('Fitur tidak ditemukan', 404);
        await cms_repository_js_1.productFeatureRepo.delete(featureId);
        await invalidateProductFeatureCache();
    },
};
