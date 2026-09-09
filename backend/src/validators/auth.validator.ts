/**
 * validators/auth.validator.ts
 *
 * Zod schemas untuk semua endpoint Auth.
 */

import { z } from 'zod';

const emailField = z
  .string()
  .min(1, { message: 'Email wajib diisi' })
  .trim()
  .toLowerCase()
  .email({ message: 'Format email tidak valid' });

const passwordField = z
  .string()
  .min(8, { message: 'Password minimal 8 karakter' })
  .max(128, { message: 'Password terlalu panjang' });

const tokenField = z
  .string()
  .min(1, { message: 'Token wajib diisi' })
  .trim();

// ✅ Perbaikan: ID sekarang UUID (string), bukan number
const userIdField = z
  .string()
  .min(1, { message: 'User ID wajib diisi' })
  .uuid({ message: 'Format User ID tidak valid' });

// ======= SCHEMAS =======

/** POST /auth/login */
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: 'Password wajib diisi' }),
});

/** POST /auth/setup-totp */
export const setupTotpSchema = z.object({
  userId: userIdField,
  token: tokenField,
});

/** POST /auth/verify-totp */
export const verifyTotpSchema = z.object({
  userId: userIdField,
  token: tokenField,
});

/** POST /auth/request-otp */
export const requestOtpSchema = z.object({
  email: emailField,
});

/** POST /auth/verify-otp */
export const verifyOtpSchema = z.object({
  email: emailField,
  code: z.string().min(1, { message: 'Kode OTP wajib diisi' }).trim(),
});

/** POST /auth/resend-otp */
export const resendOtpSchema = z.object({
  email: emailField,
});

/** POST /auth/forgot-password */
export const forgotPasswordSchema = z.object({
  email: emailField,
});

/** POST /auth/reset-password */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token wajib diisi' }).trim(),
  newPassword: passwordField,
});