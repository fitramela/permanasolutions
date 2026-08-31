/**
 * repositories/leads.repository.ts
 *
 * Semua operasi database untuk Leads.
 */

import { prisma } from '../prisma.js';
import type { Prisma } from '@prisma/client';

export const leadsRepo = {
  // ✅ Gunakan Prisma.leadsCreateInput untuk type safety
  create(data: Prisma.leadsCreateInput) {
    return prisma.leads.create({
      data: {
        ...data,
        status: data.status ?? 'new',
        source: data.source ?? 'website',
      },
    });
  },

  findMany(params: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = params;
    const where: Prisma.leadsWhereInput = {};
    if (status && status !== 'all') where.status = status;

    return Promise.all([
      prisma.leads.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.leads.count({ where }),
    ]);
  },

  // ✅ id: number → string (UUID)
  findById(id: string) {
    return prisma.leads.findUnique({ where: { id } });
  },

  // ✅ id: number → string, data pakai Prisma.leadsUpdateInput
  update(id: string, data: Prisma.leadsUpdateInput) {
    return prisma.leads.update({ where: { id }, data });
  },

  // ✅ id: number → string
  delete(id: string) {
    return prisma.leads.delete({ where: { id } });
  },

  /** Digunakan oleh dashboard */
  findRecent(take: number = 100) {
    return prisma.leads.findMany({
      orderBy: { created_at: 'desc' },
      take,
    });
  },

  count() {
    return prisma.leads.count();
  },
};