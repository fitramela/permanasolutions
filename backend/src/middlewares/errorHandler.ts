/**
 * middlewares/errorHandler.ts
 *
 * Global error handler Express.
 * - Handle error Prisma (P2002, P2025)
 * - Handle ZodError (validasi)
 * - Handle custom AppError dengan statusCode
 * - Stack trace hanya ditampilkan di development
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * AppError — gunakan ini untuk melempar error yang sudah diketahui
 * dengan status code spesifik dari dalam service/controller.
 *
 * Contoh: throw new AppError('Data tidak ditemukan', 404);
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // ── Zod validation error ────────────────────────────────────
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      message: 'Data yang dikirim tidak valid',
      errors,
    });
    return;
  }

  // ── Prisma: unique constraint ───────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Data duplikat: record dengan nilai ini sudah ada',
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan',
      });
      return;
    }
  }

  // ── Custom AppError ─────────────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // ── Generic Error ───────────────────────────────────────────
  if (err instanceof Error) {
    // Jangan bocorkan detail error internal di production
    const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    const message = isDev ? err.message : 'Terjadi kesalahan pada server';

    res.status(500).json({
      success: false,
      message,
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // ── Fallback ────────────────────────────────────────────────
  res.status(500).json({ success: false, message: 'Internal server error' });
};