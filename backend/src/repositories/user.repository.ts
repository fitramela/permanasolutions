/**
 * repositories/user.repository.ts
 *
 * Semua operasi database yang berkaitan dengan Users, OTPs, dan Password Resets.
 * Layer ini hanya berbicara dengan Prisma — tidak ada logika bisnis di sini.
 */

import { prisma } from '../prisma.js';
import type { Prisma } from '@prisma/client';

export const userRepo = {
  findAll() {
    return prisma.users.findMany({
      orderBy: { created_at: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.users.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  },

  create(data: Prisma.usersCreateInput) {
    return prisma.users.create({
      data: {
        ...data,
        two_fa_enabled: data.two_fa_enabled ?? false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  },

  update(id: string, data: Prisma.usersUpdateInput) {
    return prisma.users.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
  },

  delete(id: string) {
    return prisma.users.delete({ where: { id } });
  },
};

export const otpRepo = {
  findRecent(email: string, cooldownAgo: Date) {
    return prisma.otps.findFirst({
      where: {
        email,
        used: false,
        createdAt: { gt: cooldownAgo },
        expiresAt: { gt: new Date() },
      },
    });
  },

  findValid(email: string, code: string) {
    return prisma.otps.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  create(email: string, code: string, expiresAt: Date) {
    return prisma.otps.create({ data: { email, code, expiresAt } });
  },

  markUsed(id: string) {
    return prisma.otps.update({ where: { id }, data: { used: true } });
  },

  deleteExpired(email: string) {
    return prisma.otps.deleteMany({
      where: {
        email,
        used: false,
        expiresAt: { lt: new Date() },
      },
    });
  },
};

export const passwordResetRepo = {
  upsert(email: string, token: string, expiresAt: Date) {
    return prisma.password_resets.upsert({
      where: { email },
      update: { token, expiresAt },
      create: { email, token, expiresAt },
    });
  },

  findByToken(token: string) {
    return prisma.password_resets.findUnique({ where: { token } });
  },

  delete(id: string) {
    return prisma.password_resets.delete({ where: { id } });
  },
};