"use strict";
/**
 * services/auth.service.ts
 *
 * Logika bisnis untuk autentikasi:
 * - Login dengan password + TOTP / OTP
 * - Setup TOTP pertama kali
 * - OTP request / verify / resend
 * - Logout (invalidasi token)
 * - Forgot / reset password
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const user_repository_js_1 = require("../repositories/user.repository.js");
const jwt_js_1 = require("../utils/jwt.js");
const otp_js_1 = require("../utils/otp.js");
const email_js_1 = require("../utils/email.js");
const totp_js_1 = require("../utils/totp.js");
const helpers_js_1 = require("../utils/helpers.js");
const errorHandler_js_1 = require("../middlewares/errorHandler.js");
const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
const otpLength = Number(process.env.OTP_LENGTH) || 6;
const cooldownSeconds = Number(process.env.OTP_COOLDOWN_SECONDS) || 60;
exports.authService = {
    async login(email, password) {
        const user = await user_repository_js_1.userRepo.findByEmail(email);
        if (!user) {
            throw new errorHandler_js_1.AppError('Email atau password salah', 401);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password || '');
        if (!isPasswordValid) {
            throw new errorHandler_js_1.AppError('Email atau password salah', 401);
        }
        if (!user.two_fa_enabled) {
            let secret = user.two_fa_secret;
            if (!secret) {
                const generated = (0, totp_js_1.generateTotpSecret)(user.email);
                await user_repository_js_1.userRepo.update(user.id, { two_fa_secret: generated.base32 });
                secret = generated.base32;
            }
            const otpauthUrl = (0, totp_js_1.buildOtpAuthUrl)(secret, user.email);
            const qrCode = await (0, totp_js_1.generateQrCodeDataUrl)(otpauthUrl);
            return {
                needsSetup: true,
                userId: user.id,
                qrCode,
                message: 'Scan QR code dengan Google Authenticator, lalu masukkan kode 6 digit',
            };
        }
        return {
            needsOtp: true,
            userId: user.id,
            message: 'Masukkan kode 6 digit dari Google Authenticator',
        };
    },
    async setupTotp(userId, token) {
        const user = await user_repository_js_1.userRepo.findById(userId);
        if (!user)
            throw new errorHandler_js_1.AppError('User tidak ditemukan', 404);
        if (!user.two_fa_secret)
            throw new errorHandler_js_1.AppError('User belum memiliki TOTP secret', 400);
        if (!(0, totp_js_1.verifyTotpToken)(user.two_fa_secret, token)) {
            throw new errorHandler_js_1.AppError('Kode TOTP tidak valid', 400);
        }
        await user_repository_js_1.userRepo.update(user.id, { two_fa_enabled: true });
        const jwtToken = (0, jwt_js_1.signToken)({ id: user.id, email: user.email });
        return { user: (0, helpers_js_1.sanitizeUser)(user), token: jwtToken };
    },
    async verifyTotp(userId, token) {
        const user = await user_repository_js_1.userRepo.findById(userId);
        if (!user || !user.two_fa_secret) {
            throw new errorHandler_js_1.AppError('User tidak ditemukan atau TOTP belum dikonfigurasi', 400);
        }
        if (!(0, totp_js_1.verifyTotpToken)(user.two_fa_secret, token)) {
            throw new errorHandler_js_1.AppError('Kode TOTP tidak valid', 400);
        }
        const jwtToken = (0, jwt_js_1.signToken)({ id: user.id, email: user.email });
        return { user: (0, helpers_js_1.sanitizeUser)(user), token: jwtToken };
    },
    async requestOtp(email) {
        const user = await user_repository_js_1.userRepo.findByEmail(email);
        if (!user)
            throw new errorHandler_js_1.AppError('User tidak ditemukan', 404);
        const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
        const recentOtp = await user_repository_js_1.otpRepo.findRecent(user.email, cooldownAgo);
        if (recentOtp) {
            throw new errorHandler_js_1.AppError(`Tunggu ${cooldownSeconds} detik sebelum meminta OTP lagi`, 429);
        }
        const code = (0, otp_js_1.generateOtp)(otpLength);
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
        await user_repository_js_1.otpRepo.create(user.email, code, expiresAt);
        await (0, email_js_1.sendOtpEmail)(user.email, code);
        return { message: `Kode OTP dikirim ke email Anda (berlaku ${expiryMinutes} menit)` };
    },
    async verifyOtp(email, code) {
        const otpRecord = await user_repository_js_1.otpRepo.findValid(email, code);
        if (!otpRecord) {
            throw new errorHandler_js_1.AppError('Kode OTP tidak valid atau sudah kadaluarsa', 401);
        }
        await user_repository_js_1.otpRepo.markUsed(otpRecord.id);
        const user = await user_repository_js_1.userRepo.findByEmail(email);
        if (!user)
            throw new errorHandler_js_1.AppError('User tidak ditemukan', 404);
        await user_repository_js_1.userRepo.update(user.id, { last_login_at: new Date() });
        const jwtToken = (0, jwt_js_1.signToken)({ id: user.id, email: user.email });
        return { user: (0, helpers_js_1.sanitizeUser)(user), token: jwtToken };
    },
    async resendOtp(email) {
        const user = await user_repository_js_1.userRepo.findByEmail(email);
        if (!user)
            throw new errorHandler_js_1.AppError('User tidak ditemukan', 404);
        const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
        const recentOtp = await user_repository_js_1.otpRepo.findRecent(user.email, cooldownAgo);
        if (recentOtp) {
            throw new errorHandler_js_1.AppError(`Tunggu ${cooldownSeconds} detik sebelum meminta ulang OTP`, 429);
        }
        await user_repository_js_1.otpRepo.deleteExpired(user.email);
        const code = (0, otp_js_1.generateOtp)(otpLength);
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
        await user_repository_js_1.otpRepo.create(user.email, code, expiresAt);
        await (0, email_js_1.sendOtpEmail)(user.email, code);
        return { message: `Kode OTP baru dikirim ke email Anda (berlaku ${expiryMinutes} menit)` };
    },
    async logout(token) {
        await (0, jwt_js_1.invalidateToken)(token);
        return { message: 'Logout berhasil' };
    },
    async forgotPassword(email) {
        const user = await user_repository_js_1.userRepo.findByEmail(email);
        if (!user)
            throw new errorHandler_js_1.AppError('Email tidak terdaftar', 404);
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await user_repository_js_1.passwordResetRepo.upsert(email, token, expiresAt);
        const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
        await (0, email_js_1.sendResetPasswordEmail)(email, resetLink);
        return { message: 'Link reset password telah dikirim ke email Anda' };
    },
    async resetPassword(token, newPassword) {
        const record = await user_repository_js_1.passwordResetRepo.findByToken(token);
        if (!record || record.expiresAt < new Date()) {
            throw new errorHandler_js_1.AppError('Token tidak valid atau sudah kadaluarsa', 400);
        }
        const user = await user_repository_js_1.userRepo.findByEmail(record.email);
        if (!user)
            throw new errorHandler_js_1.AppError('User tidak ditemukan', 404);
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 12);
        await user_repository_js_1.userRepo.update(user.id, { password: hashedPassword });
        await user_repository_js_1.passwordResetRepo.delete(record.id);
        return { message: 'Password berhasil direset' };
    },
};
