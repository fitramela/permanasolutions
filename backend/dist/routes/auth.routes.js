"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_js_1 = require("../prisma.js");
const asyncHandler_js_1 = require("../middlewares/asyncHandler.js");
const totp_js_1 = require("../utils/totp.js");
const jwt_js_1 = require("../utils/jwt.js");
const email_js_1 = require("../utils/email.js");
const otp_js_1 = require("../utils/otp.js");
const helpers_js_1 = require("../utils/helpers.js");
const router = (0, express_1.Router)();
const cooldownSeconds = Number(process.env.OTP_COOLDOWN_SECONDS) || 60;
const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
const otpLength = Number(process.env.OTP_LENGTH) || 6;
router.post('/login', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const email = (0, helpers_js_1.normalizeEmail)(req.body?.email);
    const password = (0, helpers_js_1.normalizeString)(req.body?.password, 'Password');
    const user = await prisma_js_1.prisma.users.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password || '');
    if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.two_fa_enabled) {
        if (!user.two_fa_secret) {
            const { base32 } = (0, totp_js_1.generateTotpSecret)(user.email);
            await prisma_js_1.prisma.users.update({
                where: { id: user.id },
                data: { two_fa_secret: base32 },
            });
            user.two_fa_secret = base32;
        }
        const otpauthUrl = (0, totp_js_1.buildOtpAuthUrl)(user.two_fa_secret, user.email);
        const qrCode = await (0, totp_js_1.generateQrCodeDataUrl)(otpauthUrl);
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
}));
router.post('/setup-totp', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { userId, token } = req.body;
    (0, helpers_js_1.normalizeString)(token, 'Token');
    const user = await prisma_js_1.prisma.users.findUnique({
        where: { id: (0, helpers_js_1.normalizeUuid)(userId) },
    });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.two_fa_secret) {
        return res.status(400).json({ success: false, message: 'User has no TOTP secret. Please contact admin.' });
    }
    const isValid = (0, totp_js_1.verifyTotpToken)(user.two_fa_secret, token);
    if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid TOTP code. Please try again.' });
    }
    await prisma_js_1.prisma.users.update({
        where: { id: user.id },
        data: { two_fa_enabled: true },
    });
    const jwtToken = (0, jwt_js_1.signToken)({ id: user.id.toString(), email: user.email });
    const userSafe = (0, helpers_js_1.sanitizeUser)(user);
    return res.json({
        success: true,
        message: '2FA successfully enabled. Welcome!',
        user: userSafe,
        token: jwtToken,
    });
}));
router.post('/verify-totp', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { userId, token } = req.body;
    (0, helpers_js_1.normalizeString)(token, 'Token');
    const user = await prisma_js_1.prisma.users.findUnique({
        where: { id: (0, helpers_js_1.normalizeUuid)(userId) },
    });
    if (!user || !user.two_fa_secret) {
        return res.status(400).json({ success: false, message: 'User not found or TOTP not set up' });
    }
    const isValid = (0, totp_js_1.verifyTotpToken)(user.two_fa_secret, token);
    if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid TOTP code' });
    }
    const jwtToken = (0, jwt_js_1.signToken)({ id: user.id.toString(), email: user.email });
    const userSafe = (0, helpers_js_1.sanitizeUser)(user);
    return res.json({
        success: true,
        message: 'Login successful',
        user: userSafe,
        token: jwtToken,
    });
}));
router.post('/request-otp', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const email = (0, helpers_js_1.normalizeEmail)(req.body?.email);
    const user = await prisma_js_1.prisma.users.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
    const recentOtp = await prisma_js_1.prisma.otps.findFirst({
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
    const otpCode = (0, otp_js_1.generateOtp)(otpLength);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    await prisma_js_1.prisma.otps.create({
        data: {
            email: user.email,
            code: otpCode,
            expiresAt,
        },
    });
    await (0, email_js_1.sendOtpEmail)(user.email, otpCode);
    res.json({
        success: true,
        message: `Kode OTP telah dikirim ke email Anda (berlaku ${expiryMinutes} menit)`,
    });
}));
router.post('/verify-otp', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const email = (0, helpers_js_1.normalizeEmail)(req.body?.email);
    const code = (0, helpers_js_1.normalizeString)(req.body?.code, 'Code');
    const otpRecord = await prisma_js_1.prisma.otps.findFirst({
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
    await prisma_js_1.prisma.otps.update({
        where: { id: otpRecord.id },
        data: { used: true },
    });
    const user = await prisma_js_1.prisma.users.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    await prisma_js_1.prisma.users.update({
        where: { id: user.id },
        data: { last_login_at: new Date() },
    });
    const jwtToken = (0, jwt_js_1.signToken)({ id: user.id.toString(), email: user.email });
    const userSafe = (0, helpers_js_1.sanitizeUser)(user);
    res.json({
        success: true,
        message: 'Login berhasil',
        user: userSafe,
        token: jwtToken,
    });
}));
router.post('/resend-otp', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const email = (0, helpers_js_1.normalizeEmail)(req.body?.email);
    const user = await prisma_js_1.prisma.users.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
    const recentOtp = await prisma_js_1.prisma.otps.findFirst({
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
    await prisma_js_1.prisma.otps.deleteMany({
        where: {
            email: user.email,
            used: false,
            expiresAt: { lt: new Date() },
        },
    });
    const otpCode = (0, otp_js_1.generateOtp)(otpLength);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    await prisma_js_1.prisma.otps.create({
        data: {
            email: user.email,
            code: otpCode,
            expiresAt,
        },
    });
    await (0, email_js_1.sendOtpEmail)(user.email, otpCode);
    res.json({
        success: true,
        message: `Kode OTP baru telah dikirim ke email Anda (berlaku ${expiryMinutes} menit)`,
    });
}));
router.post('/logout', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    res.json({ success: true, message: 'Logout berhasil' });
}));
router.post('/forgot-password', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const email = (0, helpers_js_1.normalizeEmail)(req.body?.email);
    const user = await prisma_js_1.prisma.users.findUnique({ where: { email } });
    if (!user) {
        return res.status(404).json({ success: false, message: 'Email tidak terdaftar' });
    }
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await prisma_js_1.prisma.password_resets.upsert({
        where: { email },
        update: { token, expiresAt },
        create: { email, token, expiresAt },
    });
    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
    await (0, email_js_1.sendResetPasswordEmail)(email, resetLink);
    res.json({ success: true, message: 'Link reset password telah dikirim ke email Anda' });
}));
router.post('/reset-password', (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Token dan password baru wajib diisi',
        });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password baru minimal 6 karakter',
        });
    }
    const resetRecord = await prisma_js_1.prisma.password_resets.findUnique({
        where: { token },
    });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
        return res.status(400).json({
            success: false,
            message: 'Token tidak valid atau kadaluarsa',
        });
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await prisma_js_1.prisma.users.update({
        where: { email: resetRecord.email },
        data: { password: hashedPassword },
    });
    await prisma_js_1.prisma.password_resets.delete({
        where: { id: resetRecord.id },
    });
    res.json({
        success: true,
        message: 'Password berhasil direset',
    });
}));
exports.default = router;
