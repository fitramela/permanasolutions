"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = require("../prisma.js");
const asyncHandler_js_1 = require("../middlewares/asyncHandler.js");
const totp_js_1 = require("../utils/totp.js");
const auth_js_1 = require("../middlewares/auth.js");
const helpers_js_1 = require("../utils/helpers.js");
const redis_js_1 = require("../utils/redis.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
// CACHE HELPERS (diperbaiki untuk UUID string)
function getCacheKeyForList() {
    return 'users:list';
}
function getCacheKeyForSingle(id) {
    return `users:${id}`;
}
async function invalidateUserCache(id) {
    try {
        const listKey = getCacheKeyForList();
        await redis_js_1.redis.del(listKey);
        if (id) {
            const singleKey = getCacheKeyForSingle(id);
            await redis_js_1.redis.del(singleKey);
        }
    }
    catch (error) {
        console.error('❌ Redis cache invalidation error:', error);
    }
}
// GET /api/users - List all users (with cache)
router.get('/', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const cacheKey = getCacheKeyForList();
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({
            success: true,
            fromCache: true,
            data: JSON.parse(cached),
        });
    }
    const users = await prisma_js_1.prisma.users.findMany();
    const safeUsers = users.map((user) => (0, helpers_js_1.sanitizeUser)(user));
    await redis_js_1.redis.setex(cacheKey, 60, JSON.stringify(safeUsers));
    res.json({ success: true, fromCache: false, data: safeUsers });
}));
// GET /api/users/:id - Get user by ID (with cache)
router.get('/:id', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const cacheKey = getCacheKeyForSingle(id);
    const cached = await redis_js_1.redis.get(cacheKey);
    if (cached) {
        return res.json({
            success: true,
            fromCache: true,
            data: JSON.parse(cached),
        });
    }
    const user = await prisma_js_1.prisma.users.findUnique({ where: { id } });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const safeUser = (0, helpers_js_1.sanitizeUser)(user);
    await redis_js_1.redis.setex(cacheKey, 60, JSON.stringify(safeUser));
    res.json({ success: true, fromCache: false, data: safeUser });
}));
// POST /api/users - Create user (invalidates cache)
router.post('/', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { name, password, active_status = true } = req.body;
    let email;
    try {
        email = (0, helpers_js_1.normalizeEmail)(req.body?.email);
        (0, helpers_js_1.normalizeString)(password, 'Password');
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const { base32: twoFaSecret } = (0, totp_js_1.generateTotpSecret)(email);
    const newUser = await prisma_js_1.prisma.users.create({
        data: {
            name,
            email,
            password: hashedPassword,
            active_status,
            two_fa_secret: twoFaSecret,
            two_fa_enabled: false,
            created_at: new Date(),
            updated_at: new Date(),
        },
    });
    await invalidateUserCache(); // Hapus cache list
    res.status(201).json({ success: true, data: (0, helpers_js_1.sanitizeUser)(newUser) });
}));
// PUT /api/users/:id - Update user (invalidates cache)
router.put('/:id', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const { name, email, password, active_status } = req.body;
    const updateData = { updated_at: new Date() };
    if (name !== undefined)
        updateData.name = (0, helpers_js_1.normalizeString)(name, 'Name');
    if (email !== undefined)
        updateData.email = (0, helpers_js_1.normalizeEmail)(email);
    if (password !== undefined)
        updateData.password = await bcrypt_1.default.hash((0, helpers_js_1.normalizeString)(password, 'Password'), 10);
    if (active_status !== undefined)
        updateData.active_status = active_status;
    const updatedUser = await prisma_js_1.prisma.users.update({
        where: { id },
        data: updateData,
    });
    await invalidateUserCache(id);
    res.json({ success: true, data: (0, helpers_js_1.sanitizeUser)(updatedUser) });
}));
// DELETE /api/users/:id - Delete user (invalidates cache)
router.delete('/:id', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    await prisma_js_1.prisma.users.delete({ where: { id } });
    await invalidateUserCache(id);
    res.json({ success: true, message: 'User deleted successfully' });
}));
// POST /api/users/:id/reset-2fa - Reset 2FA (invalidates cache)
router.post('/:id/reset-2fa', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    let id;
    try {
        id = (0, helpers_js_1.normalizeUuid)(req.params.id);
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
    const user = await prisma_js_1.prisma.users.findUnique({ where: { id } });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { base32: newSecret, otpauthUrl } = (0, totp_js_1.generateTotpSecret)(user.email);
    await prisma_js_1.prisma.users.update({
        where: { id },
        data: {
            two_fa_secret: newSecret,
            two_fa_enabled: false,
        },
    });
    const qrCode = await (0, totp_js_1.generateQrCodeDataUrl)(otpauthUrl);
    await invalidateUserCache(id);
    res.json({
        success: true,
        message: '2FA secret has been reset. Please scan the new QR code.',
        data: {
            userId: id,
            secret: newSecret,
            qrCode,
        },
    });
}));
exports.default = router;
