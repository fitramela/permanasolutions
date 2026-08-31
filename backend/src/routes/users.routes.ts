import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { generateTotpSecret, generateQrCodeDataUrl } from '../utils/totp.js';
import { authenticate } from '../middlewares/auth.js';
import { normalizeEmail, normalizeString, normalizeUuid, sanitizeUser } from '../utils/helpers.js';
import { redis } from '../utils/redis.js';

const router = Router();

router.use(authenticate);


// CACHE HELPERS (diperbaiki untuk UUID string)


function getCacheKeyForList(): string {
  return 'users:list';
}

function getCacheKeyForSingle(id: string): string {
  return `users:${id}`;
}

async function invalidateUserCache(id?: string): Promise<void> {
  try {
    const listKey = getCacheKeyForList();
    await redis.del(listKey);
    if (id) {
      const singleKey = getCacheKeyForSingle(id);
      await redis.del(singleKey);
    }
  } catch (error) {
    console.error('❌ Redis cache invalidation error:', error);
  }
}


// GET /api/users - List all users (with cache)

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const cacheKey = getCacheKeyForList();
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const users = await prisma.users.findMany();
    const safeUsers = users.map((user: any) => sanitizeUser(user));

    await redis.setex(cacheKey, 60, JSON.stringify(safeUsers));

    res.json({ success: true, fromCache: false, data: safeUsers });
  })
);


// GET /api/users/:id - Get user by ID (with cache)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const cacheKey = getCacheKeyForSingle(id);
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const safeUser = sanitizeUser(user);
    await redis.setex(cacheKey, 60, JSON.stringify(safeUser));

    res.json({ success: true, fromCache: false, data: safeUser });
  })
);


// POST /api/users - Create user (invalidates cache)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, password, active_status = true } = req.body;
    let email: string;

    try {
      email = normalizeEmail(req.body?.email);
      normalizeString(password, 'Password');
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { base32: twoFaSecret } = generateTotpSecret(email);

    const newUser = await prisma.users.create({
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

    res.status(201).json({ success: true, data: sanitizeUser(newUser) });
  })
);

// PUT /api/users/:id - Update user (invalidates cache)
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { name, email, password, active_status } = req.body;
    const updateData: any = { updated_at: new Date() };

    if (name !== undefined) updateData.name = normalizeString(name, 'Name');
    if (email !== undefined) updateData.email = normalizeEmail(email);
    if (password !== undefined) updateData.password = await bcrypt.hash(normalizeString(password, 'Password'), 10);
    if (active_status !== undefined) updateData.active_status = active_status;

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updateData,
    });

    await invalidateUserCache(id);

    res.json({ success: true, data: sanitizeUser(updatedUser) });
  })
);

// DELETE /api/users/:id - Delete user (invalidates cache)
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    await prisma.users.delete({ where: { id } });

    await invalidateUserCache(id);

    res.json({ success: true, message: 'User deleted successfully' });
  })
);

// POST /api/users/:id/reset-2fa - Reset 2FA (invalidates cache)
router.post(
  '/:id/reset-2fa',
  asyncHandler(async (req, res) => {
    let id: string;
    try {
      id = normalizeUuid(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { base32: newSecret, otpauthUrl } = generateTotpSecret(user.email);

    await prisma.users.update({
      where: { id },
      data: {
        two_fa_secret: newSecret,
        two_fa_enabled: false,
      },
    });

    const qrCode = await generateQrCodeDataUrl(otpauthUrl);

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
  })
);

export default router;