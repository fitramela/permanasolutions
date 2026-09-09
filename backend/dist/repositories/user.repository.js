"use strict";
/**
 * repositories/user.repository.ts
 *
 * Semua operasi database yang berkaitan dengan Users, OTPs, dan Password Resets.
 * Layer ini hanya berbicara dengan Prisma — tidak ada logika bisnis di sini.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetRepo = exports.otpRepo = exports.userRepo = void 0;
const prisma_js_1 = require("../prisma.js");
exports.userRepo = {
    findAll() {
        return prisma_js_1.prisma.users.findMany({
            orderBy: { created_at: 'desc' },
        });
    },
    findById(id) {
        return prisma_js_1.prisma.users.findUnique({ where: { id } });
    },
    findByEmail(email) {
        return prisma_js_1.prisma.users.findUnique({ where: { email } });
    },
    create(data) {
        return prisma_js_1.prisma.users.create({
            data: {
                ...data,
                two_fa_enabled: data.two_fa_enabled ?? false,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    },
    update(id, data) {
        return prisma_js_1.prisma.users.update({
            where: { id },
            data: { ...data, updated_at: new Date() },
        });
    },
    delete(id) {
        return prisma_js_1.prisma.users.delete({ where: { id } });
    },
};
exports.otpRepo = {
    findRecent(email, cooldownAgo) {
        return prisma_js_1.prisma.otps.findFirst({
            where: {
                email,
                used: false,
                createdAt: { gt: cooldownAgo },
                expiresAt: { gt: new Date() },
            },
        });
    },
    findValid(email, code) {
        return prisma_js_1.prisma.otps.findFirst({
            where: {
                email,
                code,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    create(email, code, expiresAt) {
        return prisma_js_1.prisma.otps.create({ data: { email, code, expiresAt } });
    },
    markUsed(id) {
        return prisma_js_1.prisma.otps.update({ where: { id }, data: { used: true } });
    },
    deleteExpired(email) {
        return prisma_js_1.prisma.otps.deleteMany({
            where: {
                email,
                used: false,
                expiresAt: { lt: new Date() },
            },
        });
    },
};
exports.passwordResetRepo = {
    upsert(email, token, expiresAt) {
        return prisma_js_1.prisma.password_resets.upsert({
            where: { email },
            update: { token, expiresAt },
            create: { email, token, expiresAt },
        });
    },
    findByToken(token) {
        return prisma_js_1.prisma.password_resets.findUnique({ where: { token } });
    },
    delete(id) {
        return prisma_js_1.prisma.password_resets.delete({ where: { id } });
    },
};
