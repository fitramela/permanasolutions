/**
 * services/leads.service.ts
 *
 * Logika bisnis untuk Leads (form kontak website).
 * Cache read-through dan invalidation dikelola di sini.
 */

import { leadsRepo } from '../repositories/leads.repository.js';
import { sendLeadNotificationEmail } from '../utils/email.js';
import { AppError } from '../middlewares/errorHandler.js';
import { cache } from '../utils/cache.js';

const CACHE_TTL = 60;
const CACHE_KEYS = {
  list: (page: number, limit: number, status?: string) =>
    `leads:list:page:${page}:limit:${limit}:status:${status ?? 'all'}`,
  single: (id: string) => `leads:${id}`,
};

async function invalidateCache(id?: string) {
  await cache.delByPattern('leads:list:*');
  if (id) await cache.del(CACHE_KEYS.single(id));
}

export const leadsService = {
  async createLead(input: {
    full_name: string;
    company?: string;
    phone: string;
    email: string;
    message: string;
  }) {
    const lead = await leadsRepo.create(input);

    sendLeadNotificationEmail({
      full_name: input.full_name,
      company: input.company || '-',
      phone: input.phone,
      email: input.email,
      message: input.message,
    }).catch((err) => console.error('[Lead] Email notification failed:', err));

    await invalidateCache();
    return { id: lead.id, full_name: lead.full_name, email: lead.email };
  },

  async listLeads(params: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = params;
    const key = CACHE_KEYS.list(page, limit, status);
    const cached = await cache.get(key);
    if (cached !== null) return { ...(cached as object), fromCache: true };

    const [leads, total] = await leadsRepo.findMany({ page, limit, status });

    const result = {
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await cache.set(key, result, CACHE_TTL);
    return { ...result, fromCache: false };
  },

  async getLead(id: string) {
    const key = CACHE_KEYS.single(id);
    const cached = await cache.get(key);
    if (cached !== null) return { data: cached, fromCache: true };

    const lead = await leadsRepo.findById(id);
    if (!lead) throw new AppError('Lead tidak ditemukan', 404);

    await cache.set(key, lead, CACHE_TTL);
    return { data: lead, fromCache: false };
  },

  async updateLead(
    id: string,
    input: {
      full_name?: string;
      company?: string | null;
      phone?: string;
      email?: string;
      message?: string;
      status?: string;
    }
  ) {
    const existing = await leadsRepo.findById(id);
    if (!existing) throw new AppError('Lead tidak ditemukan', 404);

    const updateData: Record<string, unknown> = {};
    if (input.full_name !== undefined) updateData.full_name = input.full_name;
    if (input.company !== undefined) updateData.company = input.company;
    if (input.phone !== undefined) updateData.phone = input.phone;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.message !== undefined) updateData.message = input.message;
    if (input.status !== undefined) updateData.status = input.status;

    const updated = await leadsRepo.update(id, updateData);
    await invalidateCache(id);
    return updated;
  },

  async deleteLead(id: string) {
    const existing = await leadsRepo.findById(id);
    if (!existing) throw new AppError('Lead tidak ditemukan', 404);

    await leadsRepo.delete(id);
    await invalidateCache(id);
  },

  async getRecentLeads(take: number = 100) {
    return leadsRepo.findRecent(take);
  },
};