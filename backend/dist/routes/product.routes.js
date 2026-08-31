"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_js_1 = require("../prisma.js");
const asyncHandler_js_1 = require("../middlewares/asyncHandler.js");
const auth_js_1 = require("../middlewares/auth.js");
const redis_js_1 = require("../utils/redis.js");
const helpers_js_1 = require("../utils/helpers.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
async function invalidateProductFeatureCache(productId) {
    try {
        const keys = await redis_js_1.redis.keys('cms:product-features:*');
        if (keys.length)
            await redis_js_1.redis.del(...keys);
        const masterKeys = await redis_js_1.redis.keys('cms:master:products*');
        if (masterKeys.length)
            await redis_js_1.redis.del(...masterKeys);
    }
    catch (error) {
        console.error('Invalidate product feature cache error:', error);
    }
}
router.get('/:productId/features', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let productId;
    try {
        productId = (0, helpers_js_1.normalizeUuid)(req.params.productId);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const data = await prisma_js_1.prisma.product_features.findMany({
        where: { product_id: productId },
        orderBy: [{ sort_order: 'asc' }, { id: 'desc' }],
    });
    res.json({ success: true, data });
}));
router.post('/:productId/features', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let productId;
    try {
        productId = (0, helpers_js_1.normalizeUuid)(req.params.productId);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const product = await prisma_js_1.prisma.products.findUnique({ where: { id: productId } });
    if (!product) {
        return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }
    const { title, description = null, sort_order = 0, is_active = true } = req.body ?? {};
    if (!title) {
        return res.status(400).json({ success: false, message: 'Title wajib diisi' });
    }
    const feature = await prisma_js_1.prisma.product_features.create({
        data: { product_id: productId, title, description, sort_order, is_active },
    });
    await invalidateProductFeatureCache(productId);
    res.status(201).json({ success: true, data: feature });
}));
router.put('/:productId/features/:featureId', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let productId;
    let featureId;
    try {
        productId = (0, helpers_js_1.normalizeUuid)(req.params.productId);
        featureId = (0, helpers_js_1.normalizeUuid)(req.params.featureId);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const existing = await prisma_js_1.prisma.product_features.findFirst({
        where: { id: featureId, product_id: productId },
    });
    if (!existing) {
        return res.status(404).json({ success: false, message: 'Fitur tidak ditemukan' });
    }
    const { title, description, sort_order, is_active } = req.body ?? {};
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (description !== undefined)
        updateData.description = description;
    if (sort_order !== undefined)
        updateData.sort_order = sort_order;
    if (is_active !== undefined)
        updateData.is_active = is_active;
    const feature = await prisma_js_1.prisma.product_features.update({
        where: { id: featureId },
        data: updateData,
    });
    await invalidateProductFeatureCache(productId);
    res.json({ success: true, data: feature });
}));
router.delete('/:productId/features/:featureId', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let productId;
    let featureId;
    try {
        productId = (0, helpers_js_1.normalizeUuid)(req.params.productId);
        featureId = (0, helpers_js_1.normalizeUuid)(req.params.featureId);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const existing = await prisma_js_1.prisma.product_features.findFirst({
        where: { id: featureId, product_id: productId },
    });
    if (!existing) {
        return res.status(404).json({ success: false, message: 'Fitur tidak ditemukan' });
    }
    await prisma_js_1.prisma.product_features.delete({ where: { id: featureId } });
    await invalidateProductFeatureCache(productId);
    res.json({ success: true });
}));
exports.default = router;
