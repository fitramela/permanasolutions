"use strict";
/**
 * middlewares/validate.ts
 *
 * Middleware untuk validasi request body menggunakan Zod schema.
 * Pada sukses, req.body diganti dengan data yang sudah di-parse dan di-sanitize oleh Zod.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
/**
 * Gunakan middleware ini sebelum handler untuk memvalidasi req.body.
 *
 * Contoh:
 *   router.post('/login', validate(loginSchema), authController.login);
 */
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        res.status(400).json({
            success: false,
            message: 'Data yang dikirim tidak valid',
            errors,
        });
        return;
    }
    // Ganti req.body dengan versi yang sudah divalidasi dan disanitasi
    req.body = result.data;
    next();
};
exports.validate = validate;
