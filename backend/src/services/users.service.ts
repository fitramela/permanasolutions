/**
 * services/users.service.ts
 *
 * Logika bisnis untuk manajemen Admin Users.
 * Cache read-through dan invalidation dikelola di sini.
 */

import bcrypt from 'bcrypt';
import { userRepo } from '../repositories/user.repository.js';
import { generateTotpSecret, generateQrCodeDataUrl } from '../utils/totp.js';
import { sanitizeUser } from '../utils/helpers.js';
import { AppError } from '../middlewares/errorHandler.js';
import { cache } from '../utils/cache.js';

const CACHE_TTL = 60;
const CACHE_KEYS = {
  list: () => 'users:list',
  single: (id: string) => `users:${id}`, // ✅ diubah dari number ke string
};

// ✅ diubah dari (id?: number) menjadi (id?: string)
async function invalidateCache(id?: string) {
  await cache.del(CACHE_KEYS.list());
  if (id) await cache.del(CACHE_KEYS.single(id));
}

export const usersService = {
  async listUsers() {
    const key = CACHE_KEYS.list();
    const cached = await cache.get<ReturnType<typeof sanitizeUser>[]>(key);
    if (cached !== null) return { data: cached, fromCache: true };

    const users = await userRepo.findAll();
    const safeUsers = users.map(sanitizeUser);
    await cache.set(key, safeUsers, CACHE_TTL);
    return { data: safeUsers, fromCache: false };
  },

  // ✅ diubah dari (id: number) menjadi (id: string)
  async getUser(id: string) {
    const key = CACHE_KEYS.single(id);
    const cached = await cache.get(key);
    if (cached !== null) return { data: cached, fromCache: true };

    const user = await userRepo.findById(id);
    if (!user) throw new AppError('User tidak ditemukan', 404);

    const safeUser = sanitizeUser(user);
    await cache.set(key, safeUser, CACHE_TTL);
    return { data: safeUser, fromCache: false };
  },

  async createUser(input: { name?: string; email: string; password: string; active_status?: boolean }) {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    const { base32: twoFaSecret } = generateTotpSecret(input.email);

    const newUser = await userRepo.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      active_status: input.active_status ?? true,
      two_fa_secret: twoFaSecret,
      two_fa_enabled: false,
    });

    await invalidateCache();
    return sanitizeUser(newUser);
  },

  // ✅ diubah dari (id: number, ...) menjadi (id: string, ...)
  async updateUser(
    id: string,
    input: { name?: string; email?: string; password?: string; active_status?: boolean }
  ) {
    const updateData: Record<string, unknown> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.password !== undefined) updateData.password = await bcrypt.hash(input.password, 12);
    if (input.active_status !== undefined) updateData.active_status = input.active_status;

    const updated = await userRepo.update(id, updateData);
    await invalidateCache(id);
    return sanitizeUser(updated);
  },

  // ✅ diubah dari (id: number) menjadi (id: string)
  async deleteUser(id: string) {
    await userRepo.delete(id);
    await invalidateCache(id);
  },

  // ✅ diubah dari (id: number) menjadi (id: string)
  async reset2FA(id: string) {
    const user = await userRepo.findById(id);
    if (!user) throw new AppError('User tidak ditemukan', 404);

    const { base32: newSecret, otpauthUrl } = generateTotpSecret(user.email);
    await userRepo.update(id, { two_fa_secret: newSecret, two_fa_enabled: false });

    const qrCode = await generateQrCodeDataUrl(otpauthUrl);
    await invalidateCache(id);

    return { userId: id, secret: newSecret, qrCode }; 
  },
};