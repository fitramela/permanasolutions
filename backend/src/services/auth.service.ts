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

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { userRepo, otpRepo, passwordResetRepo } from '../repositories/user.repository.js';
import { signToken, invalidateToken } from '../utils/jwt.js';
import { generateOtp } from '../utils/otp.js';
import { sendOtpEmail, sendResetPasswordEmail } from '../utils/email.js';
import { generateTotpSecret, generateQrCodeDataUrl, verifyTotpToken, buildOtpAuthUrl } from '../utils/totp.js';
import { sanitizeUser } from '../utils/helpers.js';
import { AppError } from '../middlewares/errorHandler.js';

const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
const otpLength = Number(process.env.OTP_LENGTH) || 6;
const cooldownSeconds = Number(process.env.OTP_COOLDOWN_SECONDS) || 60;

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new AppError('Email atau password salah', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      throw new AppError('Email atau password salah', 401);
    }

    if (!user.two_fa_enabled) {
      let secret = user.two_fa_secret;
      if (!secret) {
        const generated = generateTotpSecret(user.email);
        await userRepo.update(user.id, { two_fa_secret: generated.base32 });
        secret = generated.base32;
      }

      const otpauthUrl = buildOtpAuthUrl(secret, user.email);
      const qrCode = await generateQrCodeDataUrl(otpauthUrl);

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

  async setupTotp(userId: string, token: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError('User tidak ditemukan', 404);
    if (!user.two_fa_secret) throw new AppError('User belum memiliki TOTP secret', 400);

    if (!verifyTotpToken(user.two_fa_secret, token)) {
      throw new AppError('Kode TOTP tidak valid', 400);
    }

    await userRepo.update(user.id, { two_fa_enabled: true });

    const jwtToken = signToken({ id: user.id, email: user.email });
    return { user: sanitizeUser(user), token: jwtToken };
  },

  async verifyTotp(userId: string, token: string) {
    const user = await userRepo.findById(userId);
    if (!user || !user.two_fa_secret) {
      throw new AppError('User tidak ditemukan atau TOTP belum dikonfigurasi', 400);
    }

    if (!verifyTotpToken(user.two_fa_secret, token)) {
      throw new AppError('Kode TOTP tidak valid', 400);
    }

    const jwtToken = signToken({ id: user.id, email: user.email });
    return { user: sanitizeUser(user), token: jwtToken };
  },

  async requestOtp(email: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('User tidak ditemukan', 404);

    const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
    const recentOtp = await otpRepo.findRecent(user.email, cooldownAgo);
    if (recentOtp) {
      throw new AppError(`Tunggu ${cooldownSeconds} detik sebelum meminta OTP lagi`, 429);
    }

    const code = generateOtp(otpLength);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    await otpRepo.create(user.email, code, expiresAt);
    await sendOtpEmail(user.email, code);

    return { message: `Kode OTP dikirim ke email Anda (berlaku ${expiryMinutes} menit)` };
  },

  async verifyOtp(email: string, code: string) {
    const otpRecord = await otpRepo.findValid(email, code);
    if (!otpRecord) {
      throw new AppError('Kode OTP tidak valid atau sudah kadaluarsa', 401);
    }

    await otpRepo.markUsed(otpRecord.id); 

    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('User tidak ditemukan', 404);

    await userRepo.update(user.id, { last_login_at: new Date() });

    const jwtToken = signToken({ id: user.id, email: user.email });
    return { user: sanitizeUser(user), token: jwtToken };
  },

  async resendOtp(email: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('User tidak ditemukan', 404);

    const cooldownAgo = new Date(Date.now() - cooldownSeconds * 1000);
    const recentOtp = await otpRepo.findRecent(user.email, cooldownAgo);
    if (recentOtp) {
      throw new AppError(`Tunggu ${cooldownSeconds} detik sebelum meminta ulang OTP`, 429);
    }

    await otpRepo.deleteExpired(user.email);

    const code = generateOtp(otpLength);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    await otpRepo.create(user.email, code, expiresAt);
    await sendOtpEmail(user.email, code);

    return { message: `Kode OTP baru dikirim ke email Anda (berlaku ${expiryMinutes} menit)` };
  },

  async logout(token: string) {
    await invalidateToken(token);
    return { message: 'Logout berhasil' };
  },

  async forgotPassword(email: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError('Email tidak terdaftar', 404);

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await passwordResetRepo.upsert(email, token, expiresAt);

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;
    await sendResetPasswordEmail(email, resetLink);

    return { message: 'Link reset password telah dikirim ke email Anda' };
  },

  async resetPassword(token: string, newPassword: string) {
    const record = await passwordResetRepo.findByToken(token);
    if (!record || record.expiresAt < new Date()) {
      throw new AppError('Token tidak valid atau sudah kadaluarsa', 400);
    }

    const user = await userRepo.findByEmail(record.email);
    if (!user) throw new AppError('User tidak ditemukan', 404);

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userRepo.update(user.id, { password: hashedPassword });
    await passwordResetRepo.delete(record.id); 

    return { message: 'Password berhasil direset' };
  },
};