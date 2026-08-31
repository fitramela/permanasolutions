/**
 * services/cms.service.ts
 *
 * Logika bisnis untuk CMS: pages, sections, master data, dan site settings.
 * Cache read-through dan invalidation dikelola di sini.
 */

import {
  cmsPageRepo,
  cmsSectionRepo,
  siteSettingsRepo,
  masterRepo,
  productFeatureRepo,
  isMasterType,
  MASTER_ALLOWED_FIELDS,
} from '../repositories/cms.repository.js';
import { leadsRepo } from '../repositories/leads.repository.js';
import { AppError } from '../middlewares/errorHandler.js';
import { cache } from '../utils/cache.js';

const CACHE_TTL = 60; 

const CACHE_KEYS = {
  page: (slug: string, locale: string) => `cms:page:${slug}:${locale}`,
  master: (type: string, locale?: string) =>
    locale ? `cms:master:${type}:${locale}` : `cms:master:${type}`,
  settings: () => 'cms:settings',
  productFeatures: (slug: string, locale: string) => `cms:product-features:${slug}:${locale}`,
};

async function invalidatePageCache() {
  await cache.delByPattern('cms:page:*');
}

async function invalidateMasterCache(type: string) {
  await cache.delByPattern(`cms:master:${type}*`);
}

async function invalidateProductFeatureCache() {
  await cache.delByPattern('cms:product-features:*');
  await cache.delByPattern('cms:master:products*');
}


const PAGE_TITLES: Record<string, string> = {
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

function resolvePageType(slug: string): string {
  if (slug === 'global') return 'global';
  if (SERVICE_PAGE_SLUGS.has(slug)) return 'service';
  return 'page';
}

function pickAllowedFields(body: Record<string, unknown>, allowed: string[]): Record<string, unknown> {
  return Object.fromEntries(
    allowed.filter((key) => key in body && body[key] !== undefined).map((key) => [key, body[key]])
  );
}


export const cmsService = {
  async getPage(slug: string, locale: string) {
    const key = CACHE_KEYS.page(slug, locale);
    const cached = await cache.get(key);
    if (cached !== null) return { data: cached, fromCache: true };

    const page = await cmsPageRepo.findPublished(slug, locale);
    await cache.set(key, page, CACHE_TTL);
    return { data: page, fromCache: false };
  },

  async getMaster(type: string, locale?: string) {
    if (!isMasterType(type)) throw new AppError('Tipe master tidak ditemukan', 404);

    const key = CACHE_KEYS.master(type, locale);
    const cached = await cache.get(key);
    if (cached !== null) return { data: cached, fromCache: true };

    const data = await masterRepo.findActive(type, locale);
    await cache.set(key, data, CACHE_TTL);
    return { data, fromCache: false };
  },

  async getSettings() {
    const key = CACHE_KEYS.settings();
    const cached = await cache.get(key);
    if (cached !== null) return { data: cached, fromCache: true };

    const rows = await siteSettingsRepo.findAll();
    const data = Object.fromEntries(rows.map((r) => [r.setting_key, r.value]));
    await cache.set(key, data, CACHE_TTL);
    return { data, fromCache: false };
  },

  async getProductWithFeatures(slug: string, locale: string) {
    const key = CACHE_KEYS.productFeatures(slug, locale);
    const cached = await cache.get(key);
    if (cached !== null) return { data: cached, fromCache: true };

    const { prisma } = await import('../prisma.js');
    const product = await prisma.products.findFirst({
      where: { slug, locale, is_active: true },
      include: {
        features: { where: { is_active: true }, orderBy: { sort_order: 'asc' } },
      },
    });
    if (!product) throw new AppError('Produk tidak ditemukan', 404);

    await cache.set(key, product, CACHE_TTL);
    return { data: product, fromCache: false };
  },

  async upsertSection(
    slug: string,
    sectionKey: string,
    body: { locale: string; title?: string; content: Record<string, unknown>; is_active: boolean; sort_order: number }
  ) {
    const page = await cmsPageRepo.upsert(
      slug,
      body.locale,
      { title: PAGE_TITLES[slug] ?? slug, page_type: resolvePageType(slug) },
      {}
    );
    const section = await cmsSectionRepo.upsert(page.id, sectionKey, body.locale, {
      title: body.title,
      content: body.content,
      is_active: body.is_active,
      sort_order: body.sort_order,
    });

    await invalidatePageCache();
    return section;
  },

  async deleteSection(slug: string, sectionKey: string, locale: string) {
    const page = await cmsPageRepo.findBySlugLocale(slug, locale);
    if (!page) throw new AppError('Halaman tidak ditemukan', 404);

    await cmsSectionRepo.delete(page.id, sectionKey, locale);
    await invalidatePageCache();
  },

  async upsertPageMeta(
    slug: string,
    body: { locale: string; meta_title?: string | null; meta_description?: string | null; status?: string }
  ) {
    const page = await cmsPageRepo.upsert(
      slug,
      body.locale,
      {
        title: PAGE_TITLES[slug] ?? slug,
        page_type: resolvePageType(slug),
        meta_title: body.meta_title,
        meta_description: body.meta_description,
        status: body.status,
      },
      {
        meta_title: body.meta_title,
        meta_description: body.meta_description,
        status: body.status,
      }
    );

    await invalidatePageCache();
    return page;
  },

  async createMasterItem(type: string, body: Record<string, unknown>) {
    if (!isMasterType(type)) throw new AppError('Tipe master tidak ditemukan', 404);

    const data = pickAllowedFields(body, MASTER_ALLOWED_FIELDS[type]);
    const result = await masterRepo.create(type, data);

    await invalidateMasterCache(type);
    return result;
  },

  async updateMasterItem(type: string, id: string, body: Record<string, unknown>) {
    if (!isMasterType(type)) throw new AppError('Tipe master tidak ditemukan', 404);

    const data = pickAllowedFields(body, MASTER_ALLOWED_FIELDS[type]);
    const result = await masterRepo.update(type, id, data);

    await invalidateMasterCache(type);
    return result;
  },

  async deleteMasterItem(type: string, id: string) {
    if (!isMasterType(type)) throw new AppError('Tipe master tidak ditemukan', 404);

    await masterRepo.delete(type, id);
    await invalidateMasterCache(type);
  },

  async updateSetting(key: string, value: unknown) {
    const result = await siteSettingsRepo.upsert(key, value);
    await cache.del(CACHE_KEYS.settings());
    return result;
  },

  async getProductFeatures(productId: string) {
    return productFeatureRepo.findByProduct(productId);
  },

  async createProductFeature(
    productId: string,
    data: { title: string; description?: string | null; sort_order: number; is_active: boolean }
  ) {
    const { prisma } = await import('../prisma.js');
    const product = await prisma.products.findUnique({ where: { id: productId } });
    if (!product) throw new AppError('Produk tidak ditemukan', 404);

    const feature = await productFeatureRepo.create(productId, data);
    await invalidateProductFeatureCache();
    return feature;
  },

  async updateProductFeature(
    productId: string,
    featureId: string,
    data: Partial<{ title: string; description: string | null; sort_order: number; is_active: boolean }>
  ) {
    const existing = await productFeatureRepo.findOneByProduct(featureId, productId);
    if (!existing) throw new AppError('Fitur tidak ditemukan', 404);

    const feature = await productFeatureRepo.update(featureId, data);
    await invalidateProductFeatureCache();
    return feature;
  },

  async deleteProductFeature(productId: string, featureId: string) {
    const existing = await productFeatureRepo.findOneByProduct(featureId, productId);
    if (!existing) throw new AppError('Fitur tidak ditemukan', 404);

    await productFeatureRepo.delete(featureId);
    await invalidateProductFeatureCache();
  },
};