/**
 * utils/cache.ts
 *
 * Wrapper tipis di atas Redis untuk operasi cache yang konsisten.
 * Semua service menggunakan helper ini — bukan langsung memanggil redis.get/setex.
 */

import { redis } from './redis.js';

const DEFAULT_TTL = 60; // detik

export const cache = {
  /**
   * Ambil data dari cache. Mengembalikan null jika tidak ada atau expired.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redis.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /**
   * Simpan data ke cache dengan TTL (detik).
   */
  async set(key: string, data: unknown, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data));
    } catch {
      // Cache write failure tidak boleh mematikan request
    }
  },

  /**
   * Hapus satu atau lebih cache key.
   */
  async del(...keys: string[]): Promise<void> {
    if (!keys.length) return;
    try {
      await redis.del(...keys);
    } catch {
      // Ignore
    }
  },

  /**
   * Hapus semua cache key yang cocok dengan pattern (misal: 'cms:page:*').
   * Gunakan dengan hati-hati di production dengan data besar.
   */
  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length) await redis.del(...keys);
    } catch {
      // Ignore
    }
  },
};
