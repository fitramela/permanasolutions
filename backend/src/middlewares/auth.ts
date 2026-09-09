/**
 * middlewares/auth.ts
 *
 * Middleware autentikasi JWT.
 * - Cek header Authorization Bearer
 * - Verifikasi token (termasuk cek blacklist Redis)
 * - Inject req.user untuk digunakan oleh handler
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      /** Raw Bearer token — tersedia setelah `authenticate` */
      token?: string;
    }
  }
}

/**
 * Middleware: wajib login.
 * Token yang sudah di-blacklist (logout) akan ditolak.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized: Token tidak ditemukan' });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: Token tidak valid' });
    return;
  }

  try {
    const payload = await verifyToken(token);
    req.user = payload;
    req.token = token; // dibutuhkan oleh logout handler
    next();
  } catch (err: any) {
    const message =
      err.message === 'Token has been revoked'
        ? 'Sesi telah berakhir. Silakan login kembali.'
        : 'Unauthorized: Token tidak valid atau sudah expired';

    res.status(401).json({ success: false, message });
  }
};