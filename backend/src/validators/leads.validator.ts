/**
 * validators/leads.validator.ts
 *
 * Zod schemas untuk endpoint Leads.
 */

import { z } from 'zod';

const LEAD_STATUSES = ['new', 'contacted', 'in_progress', 'closed'] as const;

/** POST /leads — public form submission */
export const createLeadSchema = z.object({
  full_name: z.string().trim().min(1, { message: 'Nama lengkap wajib diisi' }).max(100),
  company: z.string().trim().max(100).optional(),
  phone: z
    .string()
    .trim()
    .min(1, { message: 'Nomor telepon wajib diisi' })
    .max(20)
    .regex(/^[+\d\s\-()]+$/, 'Format nomor telepon tidak valid'),
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })  
    .trim()
    .toLowerCase()
    .email({ message: 'Format email tidak valid' })
    .max(100),
  message: z.string().trim().min(1, { message: 'Pesan wajib diisi' }).max(5000),
});

/** PUT /leads/:id — admin update */
export const updateLeadSchema = z
  .object({
    full_name: z.string().trim().min(1).max(100).optional(),
    company: z.string().trim().max(100).nullable().optional(),
    phone: z
      .string()
      .trim()
      .max(20)
      .regex(/^[+\d\s\-()]+$/, 'Format nomor telepon tidak valid')
      .optional(),
    email: z.string().trim().toLowerCase().email().max(100).optional(),
    message: z.string().trim().min(1).max(5000).optional(),
    status: z
      .enum(LEAD_STATUSES)
      .refine((val) => LEAD_STATUSES.includes(val), {   
        message: `Status tidak valid. Pilihan: ${LEAD_STATUSES.join(', ')}`,
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diisi untuk update',
  });