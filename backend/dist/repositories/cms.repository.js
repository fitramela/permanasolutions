"use strict";
/**
 * repositories/cms.repository.ts
 *
 * Semua operasi database untuk CMS: pages, sections, settings,
 * products, clients, technologies, team members, dan product features.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.productFeatureRepo = exports.masterRepo = exports.MASTER_ALLOWED_FIELDS = exports.siteSettingsRepo = exports.cmsSectionRepo = exports.cmsPageRepo = void 0;
exports.isMasterType = isMasterType;
const prisma_js_1 = require("../prisma.js");
exports.cmsPageRepo = {
    findPublished(slug, locale) {
        return prisma_js_1.prisma.cms_pages.findFirst({
            where: { slug, locale, status: 'published' },
            include: {
                sections: {
                    where: { is_active: true },
                    orderBy: { sort_order: 'asc' },
                },
            },
        });
    },
    upsert(slug, locale, create, update) {
        return prisma_js_1.prisma.cms_pages.upsert({
            where: { slug_locale: { slug, locale } },
            create: { slug, locale, status: 'published', ...create },
            update,
        });
    },
    findBySlugLocale(slug, locale) {
        return prisma_js_1.prisma.cms_pages.findUnique({ where: { slug_locale: { slug, locale } } });
    },
};
exports.cmsSectionRepo = {
    upsert(pageId, sectionKey, locale, data) {
        return prisma_js_1.prisma.cms_sections.upsert({
            where: { page_id_section_key_locale: { page_id: pageId, section_key: sectionKey, locale } },
            create: {
                page_id: pageId,
                section_key: sectionKey,
                locale,
                title: data.title ?? sectionKey,
                content: data.content,
                is_active: data.is_active,
                sort_order: data.sort_order,
            },
            update: {
                title: data.title ?? sectionKey,
                content: data.content,
                is_active: data.is_active,
                sort_order: data.sort_order,
            },
        });
    },
    delete(pageId, sectionKey, locale) {
        return prisma_js_1.prisma.cms_sections.delete({
            where: { page_id_section_key_locale: { page_id: pageId, section_key: sectionKey, locale } },
        });
    },
};
exports.siteSettingsRepo = {
    findAll() {
        return prisma_js_1.prisma.site_settings.findMany();
    },
    upsert(key, value) {
        return prisma_js_1.prisma.site_settings.upsert({
            where: { setting_key: key },
            create: { setting_key: key, value: value },
            update: { value: value },
        });
    },
};
const MASTER_MODEL_MAP = {
    products: 'products',
    clients: 'clients',
    technologies: 'technologies',
    team: 'team_members',
};
exports.MASTER_ALLOWED_FIELDS = {
    products: ['name', 'slug', 'service', 'category', 'locale', 'description', 'image_url', 'meta', 'sort_order', 'is_active'],
    clients: ['name', 'industry', 'logo_url', 'placement', 'locale', 'sort_order', 'is_active'],
    technologies: ['name', 'category', 'logo_url', 'locale', 'sort_order', 'is_active'],
    team: ['name', 'position', 'bio', 'photo_url', 'linkedin_url', 'locale', 'sort_order', 'is_active'],
};
function isMasterType(type) {
    return type in MASTER_MODEL_MAP;
}
function getMasterModel(type) {
    return prisma_js_1.prisma[MASTER_MODEL_MAP[type]];
}
exports.masterRepo = {
    findActive(type, locale) {
        const model = getMasterModel(type);
        const where = { is_active: true };
        if (locale)
            where.locale = locale;
        return model.findMany({
            where,
            orderBy: [{ sort_order: 'asc' }, { id: 'desc' }],
        });
    },
    create(type, data) {
        return getMasterModel(type).create({ data });
    },
    update(type, id, data) {
        return getMasterModel(type).update({ where: { id }, data });
    },
    delete(type, id) {
        return getMasterModel(type).delete({ where: { id } });
    },
};
exports.productFeatureRepo = {
    findByProduct(productId) {
        return prisma_js_1.prisma.product_features.findMany({
            where: { product_id: productId },
            orderBy: [{ sort_order: 'asc' }, { id: 'desc' }],
        });
    },
    findOneByProduct(featureId, productId) {
        return prisma_js_1.prisma.product_features.findFirst({
            where: { id: featureId, product_id: productId },
        });
    },
    create(productId, data) {
        return prisma_js_1.prisma.product_features.create({
            data: { product_id: productId, ...data },
        });
    },
    update(featureId, data) {
        return prisma_js_1.prisma.product_features.update({
            where: { id: featureId },
            data,
        });
    },
    delete(featureId) {
        return prisma_js_1.prisma.product_features.delete({ where: { id: featureId } });
    },
};
