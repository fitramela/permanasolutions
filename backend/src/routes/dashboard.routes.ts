import { Router } from "express";
import { prisma } from "../prisma.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authenticate } from "../middlewares/auth.js";
import { redis } from "../utils/redis.js";

const router = Router();

router.use(authenticate);

const DASHBOARD_CACHE_KEY = "dashboard:stats";
const MESSAGES_CACHE_KEY = "dashboard:messages";

export async function invalidateDashboardCache(): Promise<void> {
  try {
    await redis.del(DASHBOARD_CACHE_KEY);
    await redis.del(MESSAGES_CACHE_KEY);

    console.log("Dashboard cache invalidated");
  } catch (error) {
    console.error("Failed to invalidate dashboard cache:", error);
  }
}

function formatLocalDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const cached = await redis.get(DASHBOARD_CACHE_KEY);

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
      const [
        pages,
        messages,
        products,
        users,
        sessions,
        services,
      ] = await Promise.all([
        prisma.cms_pages.count(),

        prisma.leads.count(),

        prisma.products.count(),

        prisma.users.count(),

        prisma.visitor_sessions.count({
          where: {
            started_at: {
              gte: start,
            },
          },
        }),

        prisma.cms_pages.count({
          where: {
            page_type: "service",
          },
        }),
      ]);

      const chartRaw = await prisma.$queryRaw<
        Array<{
          date: string;
          visitors: bigint;
          pageViews: bigint;
        }>
      >`
        SELECT
          DATE_FORMAT(viewed_at, '%Y-%m-%d') AS date,
          COUNT(DISTINCT visitor_id) AS visitors,
          COUNT(*) AS pageViews
        FROM page_views
        WHERE viewed_at >= ${start}
        GROUP BY DATE_FORMAT(viewed_at, '%Y-%m-%d')
        ORDER BY date ASC
      `;

      const series = Array.from(
        { length: 7 },
        (_, index) => {
          const date = new Date(start);

          date.setDate(
            start.getDate() + index
          );

          return {
            date: formatLocalDate(date),
            visitors: 0,
            pageViews: 0,
          };
        }
      );

      const map = new Map(
        series.map((item) => [
          item.date,
          item,
        ])
      );

      for (const row of chartRaw) {
        const item = map.get(row.date);

        if (item) {
          item.visitors = Number(
            row.visitors
          );

          item.pageViews = Number(
            row.pageViews
          );
        }
      }

      const totalVisitorsResult =
        await prisma.$queryRaw<
          Array<{
            total: bigint;
          }>
        >`
          SELECT
            COUNT(DISTINCT visitor_id) AS total
          FROM page_views
          WHERE viewed_at >= ${start}
        `;

      const totalVisitors = Number(
        totalVisitorsResult[0]?.total ?? 0
      );

      const totalPageViewsResult =
        await prisma.$queryRaw<
          Array<{
            total: bigint;
          }>
        >`
          SELECT
            COUNT(*) AS total
          FROM page_views
          WHERE viewed_at >= ${start}
        `;

      const totalPageViews = Number(
        totalPageViewsResult[0]?.total ?? 0
      );

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

      await redis.setex(
        DASHBOARD_CACHE_KEY,
        60,
        JSON.stringify(result)
      );

      return res.json({
        success: true,
        fromCache: false,
        data: result,
      });
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Gagal mengambil data dashboard",
      });
    }
  })
);

router.get(
  "/messages",
  asyncHandler(async (_req, res) => {
    const cached = await redis.get(
      MESSAGES_CACHE_KEY
    );

    if (cached) {
      return res.json({
        success: true,
        fromCache: true,
        data: JSON.parse(cached),
      });
    }

    const data =
      await prisma.leads.findMany({
        orderBy: {
          created_at: "desc",
        },

        take: 100,
      });

    await redis.setex(
      MESSAGES_CACHE_KEY,
      60,
      JSON.stringify(data)
    );

    return res.json({
      success: true,
      fromCache: false,
      data,
    });
  })
);

export default router;