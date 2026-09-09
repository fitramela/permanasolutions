"use strict";
/**
 * services/dashboard.service.ts
 *
 * Logika untuk data Dashboard admin.
 * Menggabungkan data dari berbagai tabel dan menyajikan statistik.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const prisma_js_1 = require("../prisma.js");
const analytics_repository_js_1 = require("../repositories/analytics.repository.js");
const leads_repository_js_1 = require("../repositories/leads.repository.js");
const cache_js_1 = require("../utils/cache.js");
const CACHE_KEYS = {
    stats: 'dashboard:stats',
    messages: 'dashboard:messages',
};
const CACHE_TTL = 60;
function formatDate(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}
exports.dashboardService = {
    /** Invalidasi semua cache dashboard (dipanggil dari luar jika diperlukan) */
    async invalidateCache() {
        await cache_js_1.cache.del(CACHE_KEYS.stats, CACHE_KEYS.messages);
    },
    async getStats() {
        const cached = await cache_js_1.cache.get(CACHE_KEYS.stats);
        if (cached !== null)
            return { data: cached, fromCache: true };
        // Rentang 7 hari terakhir (mulai dari awal hari ini - 6 hari)
        const since = new Date();
        since.setHours(0, 0, 0, 0);
        since.setDate(since.getDate() - 6);
        const [pages, messages, products, users, sessions, services, chartRaw, visitorsRaw, pageViewsRaw] = await Promise.all([
            prisma_js_1.prisma.cms_pages.count(),
            leads_repository_js_1.leadsRepo.count(),
            prisma_js_1.prisma.products.count(),
            prisma_js_1.prisma.users.count(),
            analytics_repository_js_1.analyticsRepo.countSessionsSince(since),
            prisma_js_1.prisma.cms_pages.count({ where: { page_type: 'service' } }),
            analytics_repository_js_1.analyticsRepo.getChartData(since),
            analytics_repository_js_1.analyticsRepo.countUniqueVisitorsSince(since),
            analytics_repository_js_1.analyticsRepo.countPageViewsSince(since),
        ]);
        // Bangun array 7 hari dengan default 0
        const series = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(since);
            d.setDate(since.getDate() + i);
            return { date: formatDate(d), visitors: 0, pageViews: 0 };
        });
        const dateMap = new Map(series.map((item) => [item.date, item]));
        for (const row of chartRaw) {
            const item = dateMap.get(row.date);
            if (item) {
                item.visitors = Number(row.visitors);
                item.pageViews = Number(row.pageViews);
            }
        }
        const result = {
            totals: { pages, messages, services, products, users },
            totalVisitors: Number(visitorsRaw[0]?.total ?? 0),
            totalSessions: sessions,
            totalPageViews: Number(pageViewsRaw[0]?.total ?? 0),
            chart: series,
        };
        await cache_js_1.cache.set(CACHE_KEYS.stats, result, CACHE_TTL);
        return { data: result, fromCache: false };
    },
    async getRecentMessages() {
        const cached = await cache_js_1.cache.get(CACHE_KEYS.messages);
        if (cached !== null)
            return { data: cached, fromCache: true };
        const data = await leads_repository_js_1.leadsRepo.findRecent(100);
        await cache_js_1.cache.set(CACHE_KEYS.messages, data, CACHE_TTL);
        return { data, fromCache: false };
    },
};
