/**
 * middlewares/validate.ts
 *
 * Middleware untuk validasi request body menggunakan Zod schema.
 * Pada sukses, req.body diganti dengan data yang sudah di-parse dan di-sanitize oleh Zod.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Gunakan middleware ini sebelum handler untuk memvalidasi req.body.
 *
 * Contoh:
 *   router.post('/login', validate(loginSchema), authController.login);
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = (result.error as ZodError).issues.map((issue) => ({
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
