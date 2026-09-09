"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateDashboardCache = invalidateDashboardCache;
const express_1 = require("express");
const prisma_js_1 = require("../prisma.js");
const asyncHandler_js_1 = require("../middlewares/asyncHandler.js");
const auth_js_1 = require("../middlewares/auth.js");
const redis_js_1 = require("../utils/redis.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authenticate);
const DASHBOARD_CACHE_KEY = "dashboard:stats";
const MESSAGES_CACHE_KEY = "dashboard:messages";
async function invalidateDashboardCache() {
    try {
        await redis_js_1.redis.del(DASHBOARD_CACHE_KEY);
        await redis_js_1.redis.del(MESSAGES_CACHE_KEY);
        console.log("Dashboard cache invalidated");
    }
    catch (error) {
        console.error("Failed to invalidate dashboard cache:", error);
    }
}
function formatLocalDate(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}
router.get("/", (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
    const cached = await redis_js_1.redis.get(DASHBOARD_CACHE_KEY);
    if (cached) {
        return res.json({
            success: true,
            fromCache: true,
            data: JSON.parse(cached),
        });
    }
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);
    try {
        const [pages, messages, products, users, sessions, services,] = await Promise.all([
            prisma_js_1.prisma.cms_pages.count(),
            prisma_js_1.prisma.leads.count(),
            prisma_js_1.prisma.products.count(),
            prisma_js_1.prisma.users.count(),
            prisma_js_1.prisma.visitor_sessions.count({
                where: {
                    started_at: {
                        gte: start,
                    },
                },
            }),
            prisma_js_1.prisma.cms_pages.count({
                where: {
                    page_type: "service",
                },
            }),
        ]);
        const chartRaw = await prisma_js_1.prisma.$queryRaw `
        SELECT
          DATE_FORMAT(viewed_at, '%Y-%m-%d') AS date,
          COUNT(DISTINCT visitor_id) AS visitors,
          COUNT(*) AS pageViews
        FROM page_views
        WHERE viewed_at >= ${start}
        GROUP BY DATE_FORMAT(viewed_at, '%Y-%m-%d')
        ORDER BY date ASC
      `;
        const series = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            return {
                date: formatLocalDate(date),
                visitors: 0,
                pageViews: 0,
            };
        });
        const map = new Map(series.map((item) => [
            item.date,
            item,
        ]));
        for (const row of chartRaw) {
            const item = map.get(row.date);
            if (item) {
                item.visitors = Number(row.visitors);
                item.pageViews = Number(row.pageViews);
            }
        }
        const totalVisitorsResult = await prisma_js_1.prisma.$queryRaw `
          SELECT
            COUNT(DISTINCT visitor_id) AS total
          FROM page_views
          WHERE viewed_at >= ${start}
        `;
        const totalVisitors = Number(totalVisitorsResult[0]?.total ?? 0);
        const totalPageViewsResult = await prisma_js_1.prisma.$queryRaw `
          SELECT
            COUNT(*) AS total
          FROM page_views
          WHERE viewed_at >= ${start}
        `;
        const totalPageViews = Number(totalPageViewsResult[0]?.total ?? 0);
        const result = {
            totals: {
                pages,
                messages,
                services,
                products,
                users,
            },
            totalVisitors,
            totalSessions: sessions,
            totalPageViews,
            chart: series,
        };
        await redis_js_1.redis.setex(DASHBOARD_CACHE_KEY, 60, JSON.stringify(result));
        return res.json({
            success: true,
            fromCache: false,
            data: result,
        });
    }
    catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data dashboard",
        });
    }
}));
router.get("/messages", (0, asyncHandler_js_1.asyncHandler)(async (_req, res) => {
    const cached = await redis_js_1.redis.get(MESSAGES_CACHE_KEY);
    if (cached) {
        return res.json({
            success: true,
            fromCache: true,
            data: JSON.parse(cached),
        });
    }
    const data = await prisma_js_1.prisma.leads.findMany({
        orderBy: {
            created_at: "desc",
        },
        take: 100,
    });
    await redis_js_1.redis.setex(MESSAGES_CACHE_KEY, 60, JSON.stringify(data));
    return res.json({
        success: true,
        fromCache: false,
        data,
    });
}));
exports.default = router;
