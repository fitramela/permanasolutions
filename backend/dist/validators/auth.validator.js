"use strict";
/**
 * validators/auth.validator.ts
 *
 * Zod schemas untuk semua endpoint Auth.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.resendOtpSchema = exports.verifyOtpSchema = exports.requestOtpSchema = exports.verifyTotpSchema = exports.setupTotpSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const emailField = zod_1.z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .trim()
    .toLowerCase()
    .email({ message: 'Format email tidak valid' });
const passwordField = zod_1.z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' })
    .max(128, { message: 'Password terlalu panjang' });
const tokenField = zod_1.z
    .string()
    .min(1, { message: 'Token wajib diisi' })
    .trim();
// ✅ Perbaikan: ID sekarang UUID (string), bukan number
const userIdField = zod_1.z
    .string()
    .min(1, { message: 'User ID wajib diisi' })
    .uuid({ message: 'Format User ID tidak valid' });
// ======= SCHEMAS =======
/** POST /auth/login */
exports.loginSchema = zod_1.z.object({
    email: emailField,
    password: zod_1.z.string().min(1, { message: 'Password wajib diisi' }),
});
/** POST /auth/setup-totp */
exports.setupTotpSchema = zod_1.z.object({
    userId: userIdField,
    token: tokenField,
});
/** POST /auth/verify-totp */
exports.verifyTotpSchema = zod_1.z.object({
    userId: userIdField,
    token: tokenField,
});
/** POST /auth/request-otp */
exports.requestOtpSchema = zod_1.z.object({
    email: emailField,
});
/** POST /auth/verify-otp */
exports.verifyOtpSchema = zod_1.z.object({
    email: emailField,
    code: zod_1.z.string().min(1, { message: 'Kode OTP wajib diisi' }).trim(),
});
/** POST /auth/resend-otp */
exports.resendOtpSchema = zod_1.z.object({
    email: emailField,
});
/** POST /auth/forgot-password */
exports.forgotPasswordSchema = zod_1.z.object({
    email: emailField,
});
/** POST /auth/reset-password */
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, { message: 'Token wajib diisi' }).trim(),
    newPassword: passwordField,
});
