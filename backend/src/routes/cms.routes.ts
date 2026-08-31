import { Router } from 'express';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/auth.js';
import { redis } from '../utils/redis.js';
import { normalizeUuid } from '../utils/helpers.js'; // ✅ tambahan

const router = Router();

const CACHE_TTL = 60;

function getPageCacheKey(slug: string, locale: string) {
  return `cms:page:${slug}:${locale}`;
}
function getMasterCacheKey(type: string, locale?: string) {
  return locale ? `cms:master:${type}:${locale}` : `cms:master:${type}`;
}
function getSettingsCacheKey() {
  return 'cms:settings';
}

async function invalidatePageCache() {
  try {
    const keys = await redis.keys('cms:page:*');
    if (keys.length) await redis.del(...keys);
  } catch (error) {
    console.error('Invalidate page cache error:', error);
  }
}

async function invalidateMasterCache(type: string) {
  try {
    const keys = await redis.keys(`cms:master:${type}*`);
    if (keys.length) await redis.del(...keys);
  } catch (error) {
    console.error('Invalidate master cache error:', error);
  }
}

async function invalidateSettingsCache() {
  try {
    await redis.del(getSettingsCacheKey());
  } catch (error) {
    console.error('Invalidate settings cache error:', error);
  }
}

const pageTitle: Record<string, string> = {
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

function resolvePageType(slug: string) {
  if (slug === 'global') return 'global';
  if (servicePageTypes.includes(slug)) return 'service';
  return 'page';
}

const masters: Record<string, { model: string; allowed: string[] }> = {
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

function master(type: string) {
  const config = masters[type];
  if (!config) throw Object.assign(new Error('Master type tidak ditemukan'), { statusCode: 404 });
  return config;
}

function pick(body: any, allowed: string[]) {
  return Object.fromEntries(allowed.filter((k) => body?.[k] !== undefined).map((k) => [k, body[k]]));
}

// ─── PUBLIC ROUTES ──────────────────────────────────────────────────────────

router.get(
  '/pages/:slug',
  asyncHandler(async (req, res) => {
    const slug = req.params.slug as string;
    const locale = (req.query.locale as string) || 'id';

    const cacheKey = getPageCacheKey(slug, locale);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }

    const page = await prisma.cms_pages.findFirst({
      where: { slug, locale, status: 'published' },
      include: {
        sections: {
          where: { is_active: true },
          orderBy: { sort_order: 'asc' },
        },
      },
    });

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(page));
    res.json({ success: true, fromCache: false, data: page });
  })
);

router.get(
  '/master/:type',
  asyncHandler(async (req, res) => {
    const type = req.params.type as string;
    const locale = req.query.locale as string | undefined;
    const config = master(type);

    const cacheKey = getMasterCacheKey(type, locale);
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const where: any = {
      is_active: true,
    };

    if (locale) {
      where.locale = locale;
    }

    let data;

    // Products membutuhkan product_features
    if (type === 'products') {
      data = await prisma.products.findMany({
        where,
        include: {
          features: {
            where: {
              is_active: true,
            },
            orderBy: {
              sort_order: 'asc',
            },
          },
        },
        orderBy: [
          {
            sort_order: 'asc',
          },
          {
            id: 'desc',
          },
        ],
      });
    } else {
      const model = (prisma as any)[config.model];

      data = await model.findMany({
        where,
        orderBy: [
          {
            sort_order: 'asc',
          },
          {
            id: 'desc',
          },
        ],
      });
    }

    await redis.setex(
      cacheKey,
      CACHE_TTL,
      JSON.stringify(data)
    );

    res.json({
      success: true,
      fromCache: false,
      data,
    });
  })
);

router.get(
  '/settings',
  asyncHandler(async (req, res) => {
    const cacheKey = getSettingsCacheKey();
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }

    const rows = await prisma.site_settings.findMany();
    const data = Object.fromEntries(rows.map((row) => [row.setting_key, row.value]));

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
    res.json({ success: true, fromCache: false, data });
  })
);

// ─── PROTECTED ROUTES ──────────────────────────────────────────────────────

const protectedRouter = Router();
protectedRouter.use(authenticate);

protectedRouter.put(
  '/pages/:slug/sections/:sectionKey',
  asyncHandler(async (req, res) => {
    const slug = req.params.slug as string;
    const sectionKey = req.params.sectionKey as string;
    const locale = (req.body.locale as string) || 'id';
    const { title, content = {}, is_active = true, sort_order = 0 } = req.body ?? {};

    const page = await prisma.cms_pages.upsert({
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

    const section = await prisma.cms_sections.upsert({
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
  })
);

protectedRouter.delete(
  '/pages/:slug/sections/:sectionKey',
  asyncHandler(async (req, res) => {
    const slug = req.params.slug as string;
    const sectionKey = req.params.sectionKey as string;
    const locale = (req.query.locale as string) || 'id';

    const page = await prisma.cms_pages.findUnique({ where: { slug_locale: { slug, locale } } });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page tidak ditemukan' });
    }

    await prisma.cms_sections.delete({
      where: { page_id_section_key_locale: { page_id: page.id, section_key: sectionKey, locale } },
    });

    await invalidatePageCache();
    res.json({ success: true });
  })
);

protectedRouter.put(
  '/pages/:slug/meta',
  asyncHandler(async (req, res) => {
    const slug = req.params.slug as string;
    const locale = (req.body.locale as string) || 'id';
    const { meta_title = null, meta_description = null, status = 'published' } = req.body ?? {};

    const page = await prisma.cms_pages.upsert({
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
  })
);

protectedRouter.post(
  '/master/:type',
  asyncHandler(async (req, res) => {
    const type = req.params.type as string;
    const config = master(type);
    const model = (prisma as any)[config.model];
    const data = await model.create({ data: pick(req.body, config.allowed) });

    await invalidateMasterCache(type);
    res.status(201).json({ success: true, data });
  })
);

// ✅ Perbaikan: id sekarang UUID (string), bukan number
protectedRouter.put(
  '/master/:type/:id',
  asyncHandler(async (req, res) => {
    const type = req.params.type as string;
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const config = master(type);
    const model = (prisma as any)[config.model];
    const data = await model.update({
      where: { id },
      data: pick(req.body, config.allowed),
    });

    await invalidateMasterCache(type);
    res.json({ success: true, data });
  })
);

// ✅ Perbaikan: id sekarang UUID (string), bukan number
protectedRouter.delete(
  '/master/:type/:id',
  asyncHandler(async (req, res) => {
    const type = req.params.type as string;
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const config = master(type);
    const model = (prisma as any)[config.model];
    await model.delete({ where: { id } });

    await invalidateMasterCache(type);
    res.json({ success: true });
  })
);

protectedRouter.put(
  '/settings/:key',
  asyncHandler(async (req, res) => {
    const key = req.params.key as string;
    const value = req.body?.value ?? {};

    const data = await prisma.site_settings.upsert({
      where: { setting_key: key },
      create: { setting_key: key, value },
      update: { value },
    });

    await invalidateSettingsCache();
    res.json({ success: true, data });
  })
);

router.use('/', protectedRouter);

export default router;