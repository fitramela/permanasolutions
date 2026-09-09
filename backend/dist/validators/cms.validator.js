"use strict";
/**
 * validators/cms.validator.ts
 *
 * Zod schemas untuk endpoint CMS (admin).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertProductFeatureSchema = exports.updateSettingSchema = exports.createMasterTeamSchema = exports.createMasterTechnologySchema = exports.createMasterClientSchema = exports.createMasterProductSchema = exports.upsertPageMetaSchema = exports.upsertSectionSchema = void 0;
const zod_1 = require("zod");
const localeField = zod_1.z.string().trim().min(1).max(10).default('id');
const sortOrderField = zod_1.z.number().int().min(0).default(0);
const isActiveField = zod_1.z.boolean().default(true);
/** PUT /cms/pages/:slug/sections/:sectionKey */
exports.upsertSectionSchema = zod_1.z.object({
    locale: localeField,
    title: zod_1.z.string().trim().max(150).optional(),
    content: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).default({}), // ✅ fixed
    is_active: isActiveField,
    sort_order: sortOrderField,
});
/** PUT /cms/pages/:slug/meta */
exports.upsertPageMetaSchema = zod_1.z.object({
    locale: localeField,
    meta_title: zod_1.z.string().trim().max(255).nullable().default(null),
    meta_description: zod_1.z.string().trim().nullable().default(null),
    status: zod_1.z.enum(['published', 'draft']).default('published'),
});
/** POST /cms/master/:type */
exports.createMasterProductSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(150),
    slug: zod_1.z.string().trim().min(1).max(150),
    service: zod_1.z.string().trim().min(1).max(50),
    category: zod_1.z.string().trim().max(100).optional(),
    locale: localeField,
    description: zod_1.z.string().trim().optional(),
    image_url: zod_1.z.string().trim().url().max(500).optional(),
    meta: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(), // ✅ fixed
    sort_order: sortOrderField,
    is_active: isActiveField,
});
exports.createMasterClientSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(150),
    industry: zod_1.z.string().trim().max(100).optional(),
    logo_url: zod_1.z.string().trim().url().max(500).optional(),
    placement: zod_1.z.string().trim().max(100).optional(),
    locale: localeField,
    sort_order: sortOrderField,
    is_active: isActiveField,
});
exports.createMasterTechnologySchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(150),
    category: zod_1.z.string().trim().max(100).optional(),
    logo_url: zod_1.z.string().trim().url().max(500).optional(),
    locale: localeField,
    sort_order: sortOrderField,
    is_active: isActiveField,
});
exports.createMasterTeamSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1).max(150),
    position: zod_1.z.string().trim().max(150).optional(),
    bio: zod_1.z.string().trim().optional(),
    photo_url: zod_1.z.string().trim().url().max(500).optional(),
    linkedin_url: zod_1.z.string().trim().url().max(500).optional(),
    locale: localeField,
    sort_order: sortOrderField,
    is_active: isActiveField,
});
/** PUT /cms/settings/:key */
exports.updateSettingSchema = zod_1.z.object({
    value: zod_1.z.unknown(),
});
/** POST/PUT /cms/products/:productId/features */
exports.upsertProductFeatureSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(150),
    description: zod_1.z.string().trim().optional().nullable(),
    sort_order: sortOrderField,
    is_active: isActiveField,
});
