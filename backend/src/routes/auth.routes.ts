import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { asyncHandler } from '../middlewares/asyncHandler';
import { generateTotpSecret, generateQrCodeDataUrl, verifyTotpToken, buildOtpAuthUrl } from '../utils/totp';
import { signToken } from '../utils/jwt';
import { sendOtpEmail } from '../utils/email';
import { generateOtp } from '../utils/otp';
import { normalizeEmail, normalizeString, normalizeUserId, sanitizeUser } from '../utils/helpers';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    let email = '';
    let password = '';

    try {
      email = normalizeEmail(req.body?.email);
      password = normalizeString(req.body?.password, 'Password');
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.two_fa_enabled) {
      if (!user.two_fa_secret) {
        const { base32, otpauthUrl } = generateTotpSecret(user.email);
        await prisma.users.update({
          where: { id: user.id },
          data: { two_fa_secret: base32 },
        });
        user.two_fa_secret = base32;
      }

      const otpauthUrl = buildOtpAuthUrl(user.two_fa_secret, user.email);
      const qrCode = await generateQrCodeDataUrl(otpauthUrl);

      return res.json({
        success: true,
        needsSetup: true,
        userId: user.id,
        qrCode,
        message: 'Scan QR code with Google Authenticator, then submit the 6-digit code',
      });
    }

    return res.json({
      success: true,
      needsOtp: true,
      userId: user.id,
      message: 'Enter the 6-digit code from your Google Authenticator app',
    });
  })
);

// POST /api/auth/setup-totp
router.post(
  '/setup-totp',
  asyncHandler(async (req, res) => {
    const { userId, token } = req.body;

    try {
      normalizeString(token, 'Token');
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await prisma.users.findUnique({
      where: { id: normalizeUserId(userId) },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.two_fa_secret) {
      return res.status(400).json({
        success: false,
        message: 'User has no TOTP secret. Please contact admin.',
      });
    }

    const isValid = verifyTotpToken(user.two_fa_secret, token);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid TOTP code. Please try again.',
      });
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { two_fa_enabled: true },
    });

    const jwtToken = signToken({ id: user.id, email: user.email });

    const { password: _pw, two_fa_secret: _secret, ...userSafe } = user;

    return res.json({
      success: true,
      message: '2FA successfully enabled. Welcome!',
      user: userSafe,
      token: jwtToken,
    });
  })
);

// POST /api/auth/verify-totp
router.post(
  '/verify-totp',
  asyncHandler(async (req, res) => {
    const { userId, token } = req.body;

    try {
      normalizeString(token, 'Token');
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await prisma.users.findUnique({
      where: { id: normalizeUserId(userId) },
    });
    if (!user || !user.two_fa_secret) {
      return res.status(400).json({
        success: false,
        message: 'User not found or TOTP not set up',
      });
    }

    const isValid = verifyTotpToken(user.two_fa_secret, token);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid TOTP code',
      });
    }

    const jwtToken = signToken({ id: user.id, email: user.email });

    const { password: _pw, two_fa_secret: _secret, ...userSafe } = user;

    return res.json({
      success: true,
      message: 'Login successful',
      user: userSafe,
      token: jwtToken,
    });
  })
);

// POST /api/auth/request-otp
router.post(
  '/request-otp',
  asyncHandler(async (req, res) => {
    let email = '';

    try {
      email = normalizeEmail(req.body?.email);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const cooldownSeconds = Number(process.env.OTP_COOLDOWN_SECONDS) || 60;
    const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
    const otpLength = Number(process.env.OTP_LENGTH) || 6;

    const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
    const recentOtp = await prisma.otp.findFirst({
      where: {
        email: user.email,
        used: false,
        createdAt: { gt: cooldownAgo },
        expiresAt: { gt: new Date() },
      },
    });

    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: `Tunggu ${cooldownSeconds} detik sebelum meminta OTP lagi.`,
      });
    }

    const otpCode = generateOtp(otpLength);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await prisma.otp.create({
      data: {
        email: user.email,
        code: otpCode,
        expiresAt,
      },
    });

    await sendOtpEmail(user.email, otpCode);

    res.json({
      success: true,
      message: `Kode OTP telah dikirim ke email Anda (berlaku ${expiryMinutes} menit)`,
    });
  })
);

// POST /api/auth/verifiy-otp
router.post(
  '/verify-otp',
  asyncHandler(async (req, res) => {
    let email = '';
    let code = '';

    try {
      email = normalizeEmail(req.body?.email);
      code = normalizeString(req.body?.code, 'Code');
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return res.status(401).json({ success: false, message: 'Kode OTP tidak valid atau sudah kadaluarsa' });
    }

    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    await prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    const jwtToken = signToken({ id: user.id, email: user.email });
    const userSafe = sanitizeUser(user);

    res.json({
      success: true,
      message: 'Login berhasil',
      user: userSafe,
      token: jwtToken,
    });
  })
);

// POST /api/auth/resend-otp
router.post(
  '/resend-otp',
  asyncHandler(async (req, res) => {
    let email = '';

    try {
      email = normalizeEmail(req.body?.email);
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const cooldownSeconds = Number(process.env.OTP_COOLDOWN_SECONDS) || 60;
    const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
    const otpLength = Number(process.env.OTP_LENGTH) || 6;

    const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
    const recentOtp = await prisma.otp.findFirst({
      where: {
        email: user.email,
        used: false,
        createdAt: { gt: cooldownAgo },
        expiresAt: { gt: new Date() },
      },
    });

    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: `Tunggu ${cooldownSeconds} detik sebelum meminta ulang OTP.`,
      });
    }

    await prisma.otp.deleteMany({
      where: {
        email: user.email,
        used: false,
        expiresAt: { lt: new Date() },
      },
    });

    const otpCode = generateOtp(otpLength);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await prisma.otp.create({
      data: {
        email: user.email,
        code: otpCode,
        expiresAt,
      },
    });

    await sendOtpEmail(user.email, otpCode);

    res.json({
      success: true,
      message: `Kode OTP baru telah dikirim ke email Anda (berlaku ${expiryMinutes} menit)`,
    });
  })
);

export default router;