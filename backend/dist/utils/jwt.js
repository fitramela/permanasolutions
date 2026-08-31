"use strict";
/**
 * utils/jwt.ts
 *
 * Helper untuk sign, verify, dan invalidate JWT token.
 * Token blacklist disimpan di Redis agar logout benar-benar memutus akses.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateToken = exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const redis_js_1 = require("./redis.js");
const JWT_SECRET = (process.env.JWT_SECRET || 'supersecretkeychangeitlater');
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d');
// Prefix key blacklist di Redis
const BLACKLIST_PREFIX = 'jwt:blacklist:';
/**
 * Buat token JWT baru.
 */
const signToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.signToken = signToken;
/**
 * Verifikasi token JWT. Throw Error jika invalid atau expired.
 * Cek juga apakah token sudah di-blacklist.
 */
const verifyToken = async (token) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        throw new Error('Invalid or expired token');
    }
    // Cek blacklist
    const tokenHash = hashToken(token);
    const isBlacklisted = await redis_js_1.redis.exists(`${BLACKLIST_PREFIX}${tokenHash}`);
    if (isBlacklisted) {
        throw new Error('Token has been revoked');
    }
    return decoded;
};
exports.verifyToken = verifyToken;
/**
 * Invalidasi token (blacklist). Dipanggil saat logout.
 * TTL blacklist sama dengan sisa waktu expiry token.
 */
const invalidateToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded?.exp ? decoded.exp - now : 60 * 60 * 24 * 7; // default 7 hari
        if (ttl > 0) {
            const tokenHash = hashToken(token);
            await redis_js_1.redis.setex(`${BLACKLIST_PREFIX}${tokenHash}`, ttl, '1');
        }
    }
    catch {
        // Tidak gagalkan request jika Redis error
    }
};
exports.invalidateToken = invalidateToken;
/**
 * Hash token untuk penyimpanan di Redis (tidak simpan token mentah).
 */
function hashToken(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
