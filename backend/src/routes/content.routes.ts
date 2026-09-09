import { Router } from 'express';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { redis } from '../utils/redis.js';

const router = Router();

const CACHE_TTL = 60;

function getPageCacheKey(slug: string, locale: string) {
  return `cms:page:${slug}:${locale}`;
}

function getMasterCacheKey(type: string, locale?: string) {
  return locale ? `cms:master:${type}:${locale}` : `cms:master:${type}`;
}

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

    const data = await prisma.cms_pages.findFirst({
      where: { slug, locale, status: 'published' },
      include: {
        sections: {
          where: { is_active: true },
          orderBy: { sort_order: 'asc' },
        },
      },
    });

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
    res.json({ success: true, fromCache: false, data });
  })
);

const models: Record<string, string> = {
  products: 'products',
  clients: 'clients',
  technologies: 'technologies',
  team: 'team_members',
};

router.get(
  '/master/:type',
  asyncHandler(async (req, res) => {
    const type = req.params.type as string;
    const locale = req.query.locale as string | undefined;
    const modelName = models[type];

    if (!modelName) {
      return res.status(404).json({ success: false, message: 'Type tidak ditemukan' });
    }

    const cacheKey = getMasterCacheKey(type, locale);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }

    const model = (prisma as any)[modelName];
    const where: any = { is_active: true };
    if (locale) where.locale = locale;

    const data = await model.findMany({
      where,
      orderBy: [{ sort_order: 'asc' }, { id: 'desc' }],
    });

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
    res.json({ success: true, fromCache: false, data });
  })
);

router.get(
  '/products/:slug/features',
  asyncHandler(async (req, res) => {
    const slug = req.params.slug as string;
    const locale = (req.query.locale as string) || 'id';

    const cacheKey = `cms:product-features:${slug}:${locale}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, fromCache: true, data: JSON.parse(cached) });
    }

    const product = await prisma.products.findFirst({
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

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(product));
    res.json({ success: true, fromCache: false, data: product });
  })
);

export default router;