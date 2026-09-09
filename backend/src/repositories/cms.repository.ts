/**
 * repositories/cms.repository.ts
 *
 * Semua operasi database untuk CMS: pages, sections, settings,
 * products, clients, technologies, team members, dan product features.
 */

import { prisma } from '../prisma.js';

export const cmsPageRepo = {
  findPublished(slug: string, locale: string) {
    return prisma.cms_pages.findFirst({
      where: { slug, locale, status: 'published' },
      include: {
        sections: {
          where: { is_active: true },
          orderBy: { sort_order: 'asc' },
        },
      },
    });
  },

  upsert(
    slug: string,
    locale: string,
    create: { title: string; page_type: string; meta_title?: string | null; meta_description?: string | null; status?: string },
    update: Partial<{ meta_title: string | null; meta_description: string | null; status: string }>
  ) {
    return prisma.cms_pages.upsert({
      where: { slug_locale: { slug, locale } },
      create: { slug, locale, status: 'published', ...create },
      update,
    });
  },

  findBySlugLocale(slug: string, locale: string) {
    return prisma.cms_pages.findUnique({ where: { slug_locale: { slug, locale } } });
  },
};

export const cmsSectionRepo = {
  upsert(
    pageId: string,
    sectionKey: string,
    locale: string,
    data: { title?: string; content: Record<string, unknown>; is_active: boolean; sort_order: number }
  ) {
    return prisma.cms_sections.upsert({
      where: { page_id_section_key_locale: { page_id: pageId, section_key: sectionKey, locale } },
      create: {
        page_id: pageId,
        section_key: sectionKey,
        locale,
        title: data.title ?? sectionKey,
        content: data.content as any,
        is_active: data.is_active,
        sort_order: data.sort_order,
      },
      update: {
        title: data.title ?? sectionKey,
        content: data.content as any,
        is_active: data.is_active,
        sort_order: data.sort_order,
      },
    });
  },

  delete(pageId: string, sectionKey: string, locale: string) {
    return prisma.cms_sections.delete({
      where: { page_id_section_key_locale: { page_id: pageId, section_key: sectionKey, locale } },
    });
  },
};

export const siteSettingsRepo = {
  findAll() {
    return prisma.site_settings.findMany();
  },

  upsert(key: string, value: unknown) {
    return prisma.site_settings.upsert({
      where: { setting_key: key },
      create: { setting_key: key, value: value as any },
      update: { value: value as any },
    });
  },
};

type MasterType = 'products' | 'clients' | 'technologies' | 'team';

const MASTER_MODEL_MAP: Record<MasterType, keyof typeof prisma> = {
  products: 'products',
  clients: 'clients',
  technologies: 'technologies',
  team: 'team_members',
};

export const MASTER_ALLOWED_FIELDS: Record<MasterType, string[]> = {
  products: ['name', 'slug', 'service', 'category', 'locale', 'description', 'image_url', 'meta', 'sort_order', 'is_active'],
  clients: ['name', 'industry', 'logo_url', 'placement', 'locale', 'sort_order', 'is_active'],
  technologies: ['name', 'category', 'logo_url', 'locale', 'sort_order', 'is_active'],
  team: ['name', 'position', 'bio', 'photo_url', 'linkedin_url', 'locale', 'sort_order', 'is_active'],
};

export function isMasterType(type: string): type is MasterType {
  return type in MASTER_MODEL_MAP;
}

function getMasterModel(type: MasterType): any {
  return (prisma as any)[MASTER_MODEL_MAP[type]];
}

export const masterRepo = {
  findActive(type: MasterType, locale?: string) {
    const model = getMasterModel(type);
    const where: Record<string, unknown> = { is_active: true };
    if (locale) where.locale = locale;
    return model.findMany({
      where,
      orderBy: [{ sort_order: 'asc' }, { id: 'desc' }],
    });
  },

  create(type: MasterType, data: Record<string, unknown>) {
    return getMasterModel(type).create({ data });
  },

  update(type: MasterType, id: string, data: Record<string, unknown>) {
    return getMasterModel(type).update({ where: { id }, data });
  },

  delete(type: MasterType, id: string) {
    return getMasterModel(type).delete({ where: { id } });
  },
};

export const productFeatureRepo = {
  findByProduct(productId: string) {
    return prisma.product_features.findMany({
      where: { product_id: productId },
      orderBy: [{ sort_order: 'asc' }, { id: 'desc' }],
    });
  },

  findOneByProduct(featureId: string, productId: string) {
    return prisma.product_features.findFirst({
      where: { id: featureId, product_id: productId },
    });
  },

  create(productId: string, data: { title: string; description?: string | null; sort_order: number; is_active: boolean }) {
    return prisma.product_features.create({
      data: { product_id: productId, ...data },
    });
  },

  update(featureId: string, data: Partial<{ title: string; description: string | null; sort_order: number; is_active: boolean }>) {
    return prisma.product_features.update({
      where: { id: featureId },
      data,
    });
  },

  delete(featureId: string) {
    return prisma.product_features.delete({ where: { id: featureId } });
  },
};