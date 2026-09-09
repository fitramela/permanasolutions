/**
 * repositories/analytics.repository.ts
 *
 * Semua operasi database untuk Visitors, Sessions, dan Page Views.
 */

import { prisma } from '../prisma.js';

export const analyticsRepo = {
  upsertVisitor(visitorId: string, now: Date) {
    return prisma.visitors.upsert({
      where: { visitor_id: visitorId },
      create: { visitor_id: visitorId, first_seen_at: now, last_seen_at: now },
      update: { last_seen_at: now },
    });
  },

  upsertSession(data: {
    visitorId: string;
    sessionId: string;
    ipHash: string | null;
    userAgent: string | null;
    networkAgentHash: string | null;
    referrer: string | null;
    now: Date;
  }) {
    return prisma.visitor_sessions.upsert({
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

  createPageView(data: {
    visitorId: string;
    sessionId: string;
    path: string;
    locale: string | null;
    referrer: string | null;
    now: Date;
  }) {
    return prisma.page_views.create({
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
  countSessionsSince(since: Date) {
    return prisma.visitor_sessions.count({ where: { started_at: { gte: since } } });
  },

  /** Chart data: visitors dan pageviews per hari */
  getChartData(since: Date) {
    return prisma.$queryRaw<Array<{ date: string; visitors: bigint; pageViews: bigint }>>`
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
  countUniqueVisitorsSince(since: Date) {
    return prisma.$queryRaw<Array<{ total: bigint }>>`
      SELECT COUNT(DISTINCT visitor_id) AS total
      FROM page_views
      WHERE viewed_at >= ${since}
    `;
  },

  /** Total page views dalam rentang waktu */
  countPageViewsSince(since: Date) {
    return prisma.$queryRaw<Array<{ total: bigint }>>`
      SELECT COUNT(*) AS total
      FROM page_views
      WHERE viewed_at >= ${since}
    `;
  },
};
