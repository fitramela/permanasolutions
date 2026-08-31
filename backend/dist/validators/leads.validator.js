"use strict";
/**
 * validators/leads.validator.ts
 *
 * Zod schemas untuk endpoint Leads.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
const LEAD_STATUSES = ['new', 'contacted', 'in_progress', 'closed'];
/** POST /leads — public form submission */
exports.createLeadSchema = zod_1.z.object({
    full_name: zod_1.z.string().trim().min(1, { message: 'Nama lengkap wajib diisi' }).max(100),
    company: zod_1.z.string().trim().max(100).optional(),
    phone: zod_1.z
        .string()
        .trim()
        .min(1, { message: 'Nomor telepon wajib diisi' })
        .max(20)
        .regex(/^[+\d\s\-()]+$/, 'Format nomor telepon tidak valid'),
    email: zod_1.z
        .string()
        .min(1, { message: 'Email wajib diisi' })
        .trim()
        .toLowerCase()
        .email({ message: 'Format email tidak valid' })
        .max(100),
    message: zod_1.z.string().trim().min(1, { message: 'Pesan wajib diisi' }).max(5000),
});
/** PUT /leads/:id — admin update */
exports.updateLeadSchema = zod_1.z
    .object({
    full_name: zod_1.z.string().trim().min(1).max(100).optional(),
    company: zod_1.z.string().trim().max(100).nullable().optional(),
    phone: zod_1.z
        .string()
        .trim()
        .max(20)
        .regex(/^[+\d\s\-()]+$/, 'Format nomor telepon tidak valid')
        .optional(),
    email: zod_1.z.string().trim().toLowerCase().email().max(100).optional(),
    message: zod_1.z.string().trim().min(1).max(5000).optional(),
    status: zod_1.z
        .enum(LEAD_STATUSES)
        .refine((val) => LEAD_STATUSES.includes(val), {
        message: `Status tidak valid. Pilihan: ${LEAD_STATUSES.join(', ')}`,
    })
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diisi untuk update',
});
