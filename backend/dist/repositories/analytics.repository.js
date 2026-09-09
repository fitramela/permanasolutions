"use strict";
/**
 * repositories/analytics.repository.ts
 *
 * Semua operasi database untuk Visitors, Sessions, dan Page Views.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRepo = void 0;
const prisma_js_1 = require("../prisma.js");
exports.analyticsRepo = {
    upsertVisitor(visitorId, now) {
        return prisma_js_1.prisma.visitors.upsert({
            where: { visitor_id: visitorId },
            create: { visitor_id: visitorId, first_seen_at: now, last_seen_at: now },
            update: { last_seen_at: now },
        });
    },
    upsertSession(data) {
        return prisma_js_1.prisma.visitor_sessions.upsert({
            where: { session_id: data.sessionId },
            create: {
                visitor_id: data.visitorId,
                session_id: data.sessionId,
                ip_hash: data.ipHash,
                user_agent: data.userAgent,
                network_agent_hash: data.networkAgentHash,
                referrer: data.referrer,
                started_at: data.now,
                last_seen_at: data.now,
            },
            update: {
                last_seen_at: data.now,
                ip_hash: data.ipHash,
                user_agent: data.userAgent,
                network_agent_hash: data.networkAgentHash,
            },
        });
    },
    createPageView(data) {
        return prisma_js_1.prisma.page_views.create({
            data: {
                visitor_id: data.visitorId,
                session_id: data.sessionId,
                path: data.path,
                locale: data.locale,
                referrer: data.referrer,
                viewed_at: data.now,
            },
        });
    },
    /** Digunakan oleh dashboard: jumlah session dalam 7 hari terakhir */
    countSessionsSince(since) {
        return prisma_js_1.prisma.visitor_sessions.count({ where: { started_at: { gte: since } } });
    },
    /** Chart data: visitors dan pageviews per hari */
    getChartData(since) {
        return prisma_js_1.prisma.$queryRaw `
      SELECT
        DATE_FORMAT(viewed_at, '%Y-%m-%d') AS date,
        COUNT(DISTINCT visitor_id) AS visitors,
        COUNT(*) AS pageViews
      FROM page_views
      WHERE viewed_at >= ${since}
      GROUP BY DATE_FORMAT(viewed_at, '%Y-%m-%d')
      ORDER BY date ASC
    `;
    },
    /** Total unique visitors dalam rentang waktu */
    countUniqueVisitorsSince(since) {
        return prisma_js_1.prisma.$queryRaw `
      SELECT COUNT(DISTINCT visitor_id) AS total
      FROM page_views
      WHERE viewed_at >= ${since}
    `;
    },
    /** Total page views dalam rentang waktu */
    countPageViewsSince(since) {
        return prisma_js_1.prisma.$queryRaw `
      SELECT COUNT(*) AS total
      FROM page_views
      WHERE viewed_at >= ${since}
    `;
    },
};
