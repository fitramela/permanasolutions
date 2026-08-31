/**
 * validators/cms.validator.ts
 *
 * Zod schemas untuk endpoint CMS (admin).
 */

import { z } from 'zod';

const localeField = z.string().trim().min(1).max(10).default('id');

const sortOrderField = z.number().int().min(0).default(0);

const isActiveField = z.boolean().default(true);

/** PUT /cms/pages/:slug/sections/:sectionKey */
export const upsertSectionSchema = z.object({
  locale: localeField,
  title: z.string().trim().max(150).optional(),
  content: z.record(z.string(), z.unknown()).default({}),  // ✅ fixed
  is_active: isActiveField,
  sort_order: sortOrderField,
});

/** PUT /cms/pages/:slug/meta */
export const upsertPageMetaSchema = z.object({
  locale: localeField,
  meta_title: z.string().trim().max(255).nullable().default(null),
  meta_description: z.string().trim().nullable().default(null),
  status: z.enum(['published', 'draft']).default('published'),
});

/** POST /cms/master/:type */
export const createMasterProductSchema = z.object({
  name: z.string().trim().min(1).max(150),
  slug: z.string().trim().min(1).max(150),
  service: z.string().trim().min(1).max(50),
  category: z.string().trim().max(100).optional(),
  locale: localeField,
  description: z.string().trim().optional(),
  image_url: z.string().trim().url().max(500).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),  // ✅ fixed
  sort_order: sortOrderField,
  is_active: isActiveField,
});

export const createMasterClientSchema = z.object({
  name: z.string().trim().min(1).max(150),
  industry: z.string().trim().max(100).optional(),
  logo_url: z.string().trim().url().max(500).optional(),
  placement: z.string().trim().max(100).optional(),
  locale: localeField,
  sort_order: sortOrderField,
  is_active: isActiveField,
});

export const createMasterTechnologySchema = z.object({
  name: z.string().trim().min(1).max(150),
  category: z.string().trim().max(100).optional(),
  logo_url: z.string().trim().url().max(500).optional(),
  locale: localeField,
  sort_order: sortOrderField,
  is_active: isActiveField,
});

export const createMasterTeamSchema = z.object({
  name: z.string().trim().min(1).max(150),
  position: z.string().trim().max(150).optional(),
  bio: z.string().trim().optional(),
  photo_url: z.string().trim().url().max(500).optional(),
  linkedin_url: z.string().trim().url().max(500).optional(),
  locale: localeField,
  sort_order: sortOrderField,
  is_active: isActiveField,
});

/** PUT /cms/settings/:key */
export const updateSettingSchema = z.object({
  value: z.unknown(),
});

/** POST/PUT /cms/products/:productId/features */
export const upsertProductFeatureSchema = z.object({
  title: z.string().trim().min(1).max(150),
  description: z.string().trim().optional().nullable(),
  sort_order: sortOrderField,
  is_active: isActiveField,
});