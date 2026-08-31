"use strict";
/**
 * repositories/leads.repository.ts
 *
 * Semua operasi database untuk Leads.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRepo = void 0;
const prisma_js_1 = require("../prisma.js");
exports.leadsRepo = {
    // ✅ Gunakan Prisma.leadsCreateInput untuk type safety
    create(data) {
        return prisma_js_1.prisma.leads.create({
            data: {
                ...data,
                status: data.status ?? 'new',
                source: data.source ?? 'website',
            },
        });
    },
    findMany(params) {
        const { page, limit, status } = params;
        const where = {};
        if (status && status !== 'all')
            where.status = status;
        return Promise.all([
            prisma_js_1.prisma.leads.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_js_1.prisma.leads.count({ where }),
        ]);
    },
    // ✅ id: number → string (UUID)
    findById(id) {
        return prisma_js_1.prisma.leads.findUnique({ where: { id } });
    },
    // ✅ id: number → string, data pakai Prisma.leadsUpdateInput
    update(id, data) {
        return prisma_js_1.prisma.leads.update({ where: { id }, data });
    },
    // ✅ id: number → string
    delete(id) {
        return prisma_js_1.prisma.leads.delete({ where: { id } });
    },
    /** Digunakan oleh dashboard */
    findRecent(take = 100) {
        return prisma_js_1.prisma.leads.findMany({
            orderBy: { created_at: 'desc' },
            take,
        });
    },
    count() {
        return prisma_js_1.prisma.leads.count();
    },
};
