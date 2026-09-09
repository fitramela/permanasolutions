"use client";

import {
  useMemo,
} from "react";

import {
  Monitor,
  MessageCircle,
  Laptop,
  BadgeCheck,
} from "lucide-react";

import {
  useDashboard,
} from "@/app/hooks/admin/useDashboard";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import dashboardStyles from "@/app/styles/admin/AdminDashboard.module.css";

/* =========================================================
   MERGE ADMIN STYLES
========================================================= */

const styles = {
  ...baseStyles,
  ...dashboardStyles,
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

function fmt(
  value: number
) {
  return new Intl.NumberFormat(
    "id-ID"
  ).format(
    value || 0
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Dashboard() {
  const {
    data,
    loading,
    error,
  } =
    useDashboard();

  /* =======================================================
     STATISTIC CARDS
  ======================================================= */

  const cards = [
    {
      title:
        "Total Halaman",
      value:
        data?.totals.pages ??
        0,
      subtitle:
        "Halaman",
      Icon: Monitor,
    },
    {
      title:
        "Total Pesan",
      value:
        data?.totals
          .messages ?? 0,
      subtitle:
        "Pesan",
      Icon:
        MessageCircle,
    },
    {
      title:
        "Total Service",
      value:
        data?.totals
          .services ?? 0,
      subtitle:
        "Services",
      Icon: Laptop,
    },
    {
      title:
        "Total Produk",
      value:
        data?.totals
          .products ?? 0,
      subtitle:
        "Produk",
      Icon:
        BadgeCheck,
    },
  ];

  /* =======================================================
     CHART
  ======================================================= */

  const chart =
    data?.chart ?? [];

  const points =
    useMemo(() => {
      const max =
        Math.max(
          1,
          ...chart.flatMap(
            (
              item
            ) => [
              item.visitors,
              item.pageViews,
            ]
          )
        );

      function make(
        key:
          | "visitors"
          | "pageViews"
      ) {
        return chart
          .map(
            (
              item,
              index
            ) => {
              const x =
                chart.length <=
                1
                  ? 40
                  : 40 +
                    (610 *
                      index) /
                      (chart.length -
                        1);

              const y =
                240 -
                (190 *
                  item[
                    key
                  ]) /
                  max;

              return `${x},${y}`;
            }
          )
          .join(" ");
      }

      return {
        visitors:
          make(
            "visitors"
          ),

        pageViews:
          make(
            "pageViews"
          ),
      };
    }, [chart]);

  return (
    <>
      {/* ================= HEADER ================= */}

      <div
        className={
          styles.pageHeader
        }
      >
        <div>
          <h1
            className={
              styles.pageTitle
            }
          >
            Dashboard
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            Data berikut
            diambil langsung
            dari API backend.
          </p>
        </div>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div
          className={
            styles.errorBox
          }
        >
          {error}
        </div>
      )}

      {/* ================= STATISTICS ================= */}

      <div
        className={
          styles.statGrid
        }
      >
        {cards.map(
          ({
            title,
            value,
            subtitle,
            Icon,
          }) => (
            <article
              className={
                styles.statCard
              }
              key={
                title
              }
            >
              <div
                className={
                  styles.statTop
                }
              >
                <span
                  className={
                    styles.statIcon
                  }
                >
                  <Icon
                    size={28}
                    strokeWidth={
                      1.9
                    }
                  />
                </span>

                <div
                  className={
                    styles.statContent
                  }
                >
                  <b
                    className={
                      styles.statTitle
                    }
                  >
                    {title}
                  </b>

                  <strong
                    className={
                      styles.statValue
                    }
                  >
                    {loading
                      ? "..."
                      : fmt(
                          value
                        )}
                  </strong>

                  <small
                    className={
                      styles.statSubtitle
                    }
                  >
                    {
                      subtitle
                    }
                  </small>
                </div>
              </div>

              {(error ||
                loading) && (
                <div
                  className={
                    styles.statFoot
                  }
                >
                  {error
                    ? "API bermasalah"
                    : "Memuat data..."}
                </div>
              )}
            </article>
          )
        )}
      </div>

      {/* ================= DASHBOARD GRID ================= */}

      <div
        className={
          styles.dashboardGrid
        }
      >
        {/* ================= VISITOR ================= */}

        <section
          className={
            styles.dashCard
          }
        >
          <div
            className={
              styles.dashTitle
            }
          >
            <div>
              <h2>
                Visitor
              </h2>

              <p>
                Statistik visitor
                selama 7 hari
                terakhir.
              </p>
            </div>

            <span
              className={
                styles.periodBadge
              }
            >
              7 Hari Terakhir
            </span>
          </div>

          {/* METRICS */}

          <div
            className={
              styles.metrics
            }
          >
            <div
              className={
                styles.metricItem
              }
            >
              <span>
                <i
                  className={
                    styles.visitorDot
                  }
                />

                Total Visitor
              </span>

              <b>
                {loading
                  ? "..."
                  : fmt(
                      data?.totalVisitors ??
                        0
                    )}
              </b>
            </div>

            <div
              className={
                styles.metricItem
              }
            >
              <span>
                <i
                  className={
                    styles.pageViewDot
                  }
                />

                Page Views
              </span>

              <b>
                {loading
                  ? "..."
                  : fmt(
                      data?.totalPageViews ??
                        0
                    )}
              </b>
            </div>
          </div>

          {/* CHART */}

          <div
            className={
              styles.chartWrap
            }
          >
            <div
              className={
                styles.chart
              }
            >
              <svg
                viewBox="0 0 700 300"
                preserveAspectRatio="none"
                role="img"
                aria-label="Grafik visitor dan page views"
              >
                <g
                  className={
                    styles.gridLines
                  }
                >
                  {[
                    40,
                    80,
                    120,
                    160,
                    200,
                    240,
                  ].map(
                    (
                      y
                    ) => (
                      <line
                        key={
                          y
                        }
                        x1="30"
                        y1={
                          y
                        }
                        x2="680"
                        y2={
                          y
                        }
                      />
                    )
                  )}
                </g>

                {points.visitors && (
                  <polyline
                    points={
                      points.visitors
                    }
                    className={
                      styles.lineOne
                    }
                  />
                )}

                {points.pageViews && (
                  <polyline
                    points={
                      points.pageViews
                    }
                    className={
                      styles.lineTwo
                    }
                  />
                )}
              </svg>
            </div>

            {/* DATE LABELS */}

            <div
              className={
                styles.chartLabels
              }
            >
              {chart.map(
                (
                  item
                ) => (
                  <span
                    key={
                      item.date
                    }
                  >
                    {new Date(
                      `${item.date}T00:00:00`
                    ).toLocaleDateString(
                      "id-ID",
                      {
                        day:
                          "2-digit",

                        month:
                          "short",
                      }
                    )}
                  </span>
                )
              )}
            </div>
          </div>

          {/* LEGEND */}

          <div
            className={
              styles.legend
            }
          >
            <span>
              <i
                className={
                  styles.visitorDot
                }
              />

              Total Visitor
            </span>

            <span>
              <i
                className={
                  styles.pageViewDot
                }
              />

              Page Views
            </span>
          </div>
        </section>

        {/* ================= LAST UPDATE ================= */}

        <section
          className={
            styles.dashCard
          }
        >
          <div
            className={
              styles.dashTitle
            }
          >
            <div>
              <h2>
                Last Update
              </h2>

              <p>
                Aktivitas terbaru
                dari website.
              </p>
            </div>
          </div>

          <div
            className={
              styles.updates
            }
          >
            <div
              className={
                styles.emptyState
              }
            >
              Backend saat ini
              belum menyediakan
              data Last Update.
            </div>
          </div>
        </section>
      </div>
    </>
  );
}