"use strict";
/**
 * services/analytics.service.ts
 *
 * Logika bisnis untuk pelacakan visitor & page view.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const prisma_js_1 = require("../prisma.js");
const errorHandler_js_1 = require("../middlewares/errorHandler.js");
const cache_js_1 = require("../utils/cache.js");
function hmac(value) {
    const secret = process.env.ANALYTICS_SECRET || process.env.JWT_SECRET || 'analytics-fallback-secret';
    return node_crypto_1.default.createHmac('sha256', secret).update(value).digest('hex');
}
exports.analyticsService = {
    async track(input) {
        const { visitorId, sessionId, path, locale, referrer, userAgent, rawIp } = input;
        // Rate limit per session: satu tracking per 10 detik
        const rateLimitKey = `track:session:${sessionId}`;
        const isNew = await cache_js_1.cache.get(rateLimitKey);
        if (isNew !== null) {
            throw new errorHandler_js_1.AppError('Too many tracking requests', 429);
        }
        // Simpan marker selama 10 detik (tidak pakai cache.set agar tidak JSON.stringify)
        const { redis } = await Promise.resolve().then(() => __importStar(require('../utils/redis.js')));
        await redis.set(rateLimitKey, '1', 'EX', 10, 'NX');
        const ipHash = rawIp ? hmac(rawIp) : null;
        const networkAgentHash = rawIp || userAgent ? hmac(`${rawIp}|${userAgent}`) : null;
        const now = new Date();
        // Semua operasi dalam satu transaksi
        await prisma_js_1.prisma.$transaction(async (tx) => {
            await tx.visitors.upsert({
                where: { visitor_id: visitorId },
                create: { visitor_id: visitorId, first_seen_at: now, last_seen_at: now },
                update: { last_seen_at: now },
            });
            await tx.visitor_sessions.upsert({
                where: { session_id: sessionId },
                create: {
                    visitor_id: visitorId,
                    session_id: sessionId,
                    ip_hash: ipHash,
                    user_agent: userAgent || null,
                    network_agent_hash: networkAgentHash,
                    referrer,
                    started_at: now,
                    last_seen_at: now,
                },
                update: {
                    last_seen_at: now,
                    ip_hash: ipHash,
                    user_agent: userAgent || null,
                    network_agent_hash: networkAgentHash,
                },
            });
            await tx.page_views.create({
                data: {
                    visitor_id: visitorId,
                    session_id: sessionId,
                    path,
                    locale,
                    referrer,
                    viewed_at: now,
                },
            });
        });
    },
};
