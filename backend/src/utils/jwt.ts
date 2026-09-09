/**
 * utils/jwt.ts
 *
 * Helper untuk sign, verify, dan invalidate JWT token.
 * Token blacklist disimpan di Redis agar logout benar-benar memutus akses.
 */

import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { redis } from './redis.js';
const JWT_SECRET = (process.env.JWT_SECRET || 'supersecretkeychangeitlater') as Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

// Prefix key blacklist di Redis
const BLACKLIST_PREFIX = 'jwt:blacklist:';

export interface JwtPayload {
  id: string;
  email: string;
}

/**
 * Buat token JWT baru.
 */
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifikasi token JWT. Throw Error jika invalid atau expired.
 * Cek juga apakah token sudah di-blacklist.
 */
export const verifyToken = async (token: string): Promise<JwtPayload> => {
  let decoded: JwtPayload;

  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new Error('Invalid or expired token');
  }

  // Cek blacklist
  const tokenHash = hashToken(token);
  const isBlacklisted = await redis.exists(`${BLACKLIST_PREFIX}${tokenHash}`);
  if (isBlacklisted) {
    throw new Error('Token has been revoked');
  }

  return decoded;
};

/**
 * Invalidasi token (blacklist). Dipanggil saat logout.
 * TTL blacklist sama dengan sisa waktu expiry token.
 */
export const invalidateToken = async (token: string): Promise<void> => {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded?.exp ? decoded.exp - now : 60 * 60 * 24 * 7; // default 7 hari

    if (ttl > 0) {
      const tokenHash = hashToken(token);
      await redis.setex(`${BLACKLIST_PREFIX}${tokenHash}`, ttl, '1');
    }
  } catch {
    // Tidak gagalkan request jika Redis error
  }
};

/**
 * Hash token untuk penyimpanan di Redis (tidak simpan token mentah).
 */
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}