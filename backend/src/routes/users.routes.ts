import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { asyncHandler } from '../middlewares/asyncHandler';
import { generateTotpSecret, generateQrCodeDataUrl } from '../utils/totp';
import { authenticate } from '../middlewares/auth';
import { normalizeEmail, normalizeString, normalizeUserId, sanitizeUser } from '../utils/helpers';

const router = Router();

router.use(authenticate);

// GET /api/users
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const users = await prisma.users.findMany();
    const safeUsers = users.map((user) => sanitizeUser(user));
    res.json({ success: true, data: safeUsers });
  })
);

// GET /api/users/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    let id = 0;

    try {
      id = normalizeUserId(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: sanitizeUser(user) });
  })
);

// POST /api/users – Admin creates user (generates TOTP secret, enabled=false)
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, password, active_status = true } = req.body;
    let email = '';

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

    res.status(201).json({ success: true, data: sanitizeUser(newUser) });
  })
);

// PUT /api/users/:id
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    let id = 0;

    try {
      id = normalizeUserId(req.params.id);
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

    res.json({ success: true, data: sanitizeUser(updatedUser) });
  })
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    let id = 0;

    try {
      id = normalizeUserId(req.params.id);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    await prisma.users.delete({ where: { id } });
    res.json({ success: true, message: 'User deleted successfully' });
  })
);

// POST /api/users/:id/reset-2fa – Reset 2FA secret, disable 2FA, return new QR code
router.post(
  '/:id/reset-2fa',
  asyncHandler(async (req, res) => {
    let id = 0;

    try {
      id = normalizeUserId(req.params.id);
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