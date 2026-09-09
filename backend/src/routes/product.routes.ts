import { Router } from 'express';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/auth.js';
import { redis } from '../utils/redis.js';
import { normalizeUuid } from '../utils/helpers.js'; 

const router = Router();
router.use(authenticate);

async function invalidateProductFeatureCache(productId: string) {
  try {
    const keys = await redis.keys('cms:product-features:*');
    if (keys.length) await redis.del(...keys);
    const masterKeys = await redis.keys('cms:master:products*');
    if (masterKeys.length) await redis.del(...masterKeys);
  } catch (error) {
    console.error('Invalidate product feature cache error:', error);
  }
}

router.get(
  '/:productId/features',
  asyncHandler(async (req, res) => {
    let productId: string;
    try {
      productId = normalizeUuid(req.params.productId);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const data = await prisma.product_features.findMany({
      where: { product_id: productId },
      orderBy: [{ sort_order: 'asc' }, { id: 'desc' }],
    });

    res.json({ success: true, data });
  })
);

router.post(
  '/:productId/features',
  asyncHandler(async (req, res) => {
    let productId: string;
    try {
      productId = normalizeUuid(req.params.productId);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const product = await prisma.products.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const { title, description = null, sort_order = 0, is_active = true } = req.body ?? {};
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title wajib diisi' });
    }

    const feature = await prisma.product_features.create({
      data: { product_id: productId, title, description, sort_order, is_active },
    });

    await invalidateProductFeatureCache(productId);
    res.status(201).json({ success: true, data: feature });
  })
);

router.put(
  '/:productId/features/:featureId',
  asyncHandler(async (req, res) => {
    let productId: string;
    let featureId: string;
    try {
      productId = normalizeUuid(req.params.productId);
      featureId = normalizeUuid(req.params.featureId);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const existing = await prisma.product_features.findFirst({
      where: { id: featureId, product_id: productId },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Fitur tidak ditemukan' });
    }

    const { title, description, sort_order, is_active } = req.body ?? {};
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    if (is_active !== undefined) updateData.is_active = is_active;

    const feature = await prisma.product_features.update({
      where: { id: featureId },
      data: updateData,
    });

    await invalidateProductFeatureCache(productId);
    res.json({ success: true, data: feature });
  })
);

router.delete(
  '/:productId/features/:featureId',
  asyncHandler(async (req, res) => {
    let productId: string;
    let featureId: string;
    try {
      productId = normalizeUuid(req.params.productId);
      featureId = normalizeUuid(req.params.featureId);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const existing = await prisma.product_features.findFirst({
      where: { id: featureId, product_id: productId },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Fitur tidak ditemukan' });
    }

    await prisma.product_features.delete({ where: { id: featureId } });

    await invalidateProductFeatureCache(productId);
    res.json({ success: true });
  })
);

export default router;