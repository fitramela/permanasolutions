"use strict";
/**
 * utils/cache.ts
 *
 * Wrapper tipis di atas Redis untuk operasi cache yang konsisten.
 * Semua service menggunakan helper ini — bukan langsung memanggil redis.get/setex.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const redis_js_1 = require("./redis.js");
const DEFAULT_TTL = 60; // detik
exports.cache = {
    /**
     * Ambil data dari cache. Mengembalikan null jika tidak ada atau expired.
     */
    async get(key) {
        try {
            const raw = await redis_js_1.redis.get(key);
            if (!raw)
                return null;
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    },
    /**
     * Simpan data ke cache dengan TTL (detik).
     */
    async set(key, data, ttl = DEFAULT_TTL) {
        try {
            await redis_js_1.redis.setex(key, ttl, JSON.stringify(data));
        }
        catch {
            // Cache write failure tidak boleh mematikan request
        }
    },
    /**
     * Hapus satu atau lebih cache key.
     */
    async del(...keys) {
        if (!keys.length)
            return;
        try {
            await redis_js_1.redis.del(...keys);
        }
        catch {
            // Ignore
        }
    },
    /**
     * Hapus semua cache key yang cocok dengan pattern (misal: 'cms:page:*').
     * Gunakan dengan hati-hati di production dengan data besar.
     */
    async delByPattern(pattern) {
        try {
            const keys = await redis_js_1.redis.keys(pattern);
            if (keys.length)
                await redis_js_1.redis.del(...keys);
        }
        catch {
            // Ignore
        }
    },
};
