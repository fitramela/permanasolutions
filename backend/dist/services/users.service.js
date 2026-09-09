"use strict";
/**
 * services/users.service.ts
 *
 * Logika bisnis untuk manajemen Admin Users.
 * Cache read-through dan invalidation dikelola di sini.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repository_js_1 = require("../repositories/user.repository.js");
const totp_js_1 = require("../utils/totp.js");
const helpers_js_1 = require("../utils/helpers.js");
const errorHandler_js_1 = require("../middlewares/errorHandler.js");
const cache_js_1 = require("../utils/cache.js");
const CACHE_TTL = 60;
const CACHE_KEYS = {
    list: () => 'users:list',
    single: (id) => `users:${id}`, // ✅ diubah dari number ke string
};
// ✅ diubah dari (id?: number) menjadi (id?: string)
async function invalidateCache(id) {
    await cache_js_1.cache.del(CACHE_KEYS.list());
    if (id)
        await cache_js_1.cache.del(CACHE_KEYS.single(id));
}
exports.usersService = {
    async listUsers() {
        const key = CACHE_KEYS.list();
        const cached = await cache_js_1.cache.get(key);
        if (cached !== null)
            return { data: cached, fromCache: true };
        const users = await user_repository_js_1.userRepo.findAll();
        const safeUsers = users.map(helpers_js_1.sanitizeUser);
        await cache_js_1.cache.set(key, safeUsers, CACHE_TTL);
        return { data: safeUsers, fromCache: false };
    },
    // ✅ diubah dari (id: number) menjadi (id: string)
    async getUser(id) {
        const key = CACHE_KEYS.single(id);
        const cached = await cache_js_1.cache.get(key);
        if (cached !== null)
            return { data: cached, fromCache: true };
        const user = await user_repository_js_1.userRepo.findById(id);
        if (!user)
            throw new errorHandler_js_1.AppError('User tidak ditemukan', 404);
        const safeUser = (0, helpers_js_1.sanitizeUser)(user);
        await cache_js_1.cache.set(key, safeUser, CACHE_TTL);
        return { data: safeUser, fromCache: false };
    },
    async createUser(input) {
        const hashedPassword = await bcrypt_1.default.hash(input.password, 12);
        const { base32: twoFaSecret } = (0, totp_js_1.generateTotpSecret)(input.email);
        const newUser = await user_repository_js_1.userRepo.create({
            name: input.name,
            email: input.email,
            password: hashedPassword,
            active_status: input.active_status ?? true,
            two_fa_secret: twoFaSecret,
            two_fa_enabled: false,
        });
        await invalidateCache();
        return (0, helpers_js_1.sanitizeUser)(newUser);
    },
    // ✅ diubah dari (id: number, ...) menjadi (id: string, ...)
    async updateUser(id, input) {
        const updateData = {};
        if (input.name !== undefined)
            updateData.name = input.name;
        if (input.email !== undefined)
            updateData.email = input.email;
        if (input.password !== undefined)
            updateData.password = await bcrypt_1.default.hash(input.password, 12);
        if (input.active_status !== undefined)
            updateData.active_status = input.active_status;
        const updated = await user_repository_js_1.userRepo.update(id, updateData);
        await invalidateCache(id);
        return (0, helpers_js_1.sanitizeUser)(updated);
    },
    // ✅ diubah dari (id: number) menjadi (id: string)
    async deleteUser(id) {
        await user_repository_js_1.userRepo.delete(id);
        await invalidateCache(id);
    },
    // ✅ diubah dari (id: number) menjadi (id: string)
    async reset2FA(id) {
        const user = await user_repository_js_1.userRepo.findById(id);
        if (!user)
            throw new errorHandler_js_1.AppError('User tidak ditemukan', 404);
        const { base32: newSecret, otpauthUrl } = (0, totp_js_1.generateTotpSecret)(user.email);
        await user_repository_js_1.userRepo.update(id, { two_fa_secret: newSecret, two_fa_enabled: false });
        const qrCode = await (0, totp_js_1.generateQrCodeDataUrl)(otpauthUrl);
        await invalidateCache(id);
        return { userId: id, secret: newSecret, qrCode };
    },
};
