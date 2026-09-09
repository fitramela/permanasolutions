"use strict";
/**
 * services/leads.service.ts
 *
 * Logika bisnis untuk Leads (form kontak website).
 * Cache read-through dan invalidation dikelola di sini.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsService = void 0;
const leads_repository_js_1 = require("../repositories/leads.repository.js");
const email_js_1 = require("../utils/email.js");
const errorHandler_js_1 = require("../middlewares/errorHandler.js");
const cache_js_1 = require("../utils/cache.js");
const CACHE_TTL = 60;
const CACHE_KEYS = {
    list: (page, limit, status) => `leads:list:page:${page}:limit:${limit}:status:${status ?? 'all'}`,
    single: (id) => `leads:${id}`,
};
async function invalidateCache(id) {
    await cache_js_1.cache.delByPattern('leads:list:*');
    if (id)
        await cache_js_1.cache.del(CACHE_KEYS.single(id));
}
exports.leadsService = {
    async createLead(input) {
        const lead = await leads_repository_js_1.leadsRepo.create(input);
        (0, email_js_1.sendLeadNotificationEmail)({
            full_name: input.full_name,
            company: input.company || '-',
            phone: input.phone,
            email: input.email,
            message: input.message,
        }).catch((err) => console.error('[Lead] Email notification failed:', err));
        await invalidateCache();
        return { id: lead.id, full_name: lead.full_name, email: lead.email };
    },
    async listLeads(params) {
        const { page, limit, status } = params;
        const key = CACHE_KEYS.list(page, limit, status);
        const cached = await cache_js_1.cache.get(key);
        if (cached !== null)
            return { ...cached, fromCache: true };
        const [leads, total] = await leads_repository_js_1.leadsRepo.findMany({ page, limit, status });
        const result = {
            data: leads,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
        await cache_js_1.cache.set(key, result, CACHE_TTL);
        return { ...result, fromCache: false };
    },
    async getLead(id) {
        const key = CACHE_KEYS.single(id);
        const cached = await cache_js_1.cache.get(key);
        if (cached !== null)
            return { data: cached, fromCache: true };
        const lead = await leads_repository_js_1.leadsRepo.findById(id);
        if (!lead)
            throw new errorHandler_js_1.AppError('Lead tidak ditemukan', 404);
        await cache_js_1.cache.set(key, lead, CACHE_TTL);
        return { data: lead, fromCache: false };
    },
    async updateLead(id, input) {
        const existing = await leads_repository_js_1.leadsRepo.findById(id);
        if (!existing)
            throw new errorHandler_js_1.AppError('Lead tidak ditemukan', 404);
        const updateData = {};
        if (input.full_name !== undefined)
            updateData.full_name = input.full_name;
        if (input.company !== undefined)
            updateData.company = input.company;
        if (input.phone !== undefined)
            updateData.phone = input.phone;
        if (input.email !== undefined)
            updateData.email = input.email;
        if (input.message !== undefined)
            updateData.message = input.message;
        if (input.status !== undefined)
            updateData.status = input.status;
        const updated = await leads_repository_js_1.leadsRepo.update(id, updateData);
        await invalidateCache(id);
        return updated;
    },
    async deleteLead(id) {
        const existing = await leads_repository_js_1.leadsRepo.findById(id);
        if (!existing)
            throw new errorHandler_js_1.AppError('Lead tidak ditemukan', 404);
        await leads_repository_js_1.leadsRepo.delete(id);
        await invalidateCache(id);
    },
    async getRecentLeads(take = 100) {
        return leads_repository_js_1.leadsRepo.findRecent(take);
    },
};
