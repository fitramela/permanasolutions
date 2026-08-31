"use strict";
/**
 * validators/users.validator.ts
 *
 * Zod schemas untuk endpoint Users.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
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
/** POST /users — create admin user */
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, { message: 'Nama wajib diisi' }).max(100).optional(),
    email: emailField,
    password: passwordField,
    active_status: zod_1.z.boolean().default(true),
});
/** PUT /users/:id — update user */
exports.updateUserSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(1).max(100).optional(),
    email: emailField.optional(),
    password: passwordField.optional(),
    active_status: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diisi untuk update',
});
