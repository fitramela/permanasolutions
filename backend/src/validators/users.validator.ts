/**
 * validators/users.validator.ts
 *
 * Zod schemas untuk endpoint Users.
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

/** POST /users — create admin user */
export const createUserSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nama wajib diisi' }).max(100).optional(),
  email: emailField,
  password: passwordField,
  active_status: z.boolean().default(true),
});

/** PUT /users/:id — update user */
export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    email: emailField.optional(),
    password: passwordField.optional(),
    active_status: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diisi untuk update',
  });