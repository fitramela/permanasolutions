"use client";

import { useMemo } from "react";

import {
  Monitor,
  MessageCircle,
  Laptop,
  BadgeCheck,
} from "lucide-react";

import { useDashboard } from "@/app/hooks/admin/useDashboard";
import styles from "@/app/styles/admin/AdminUI.module.css";

function fmt(value: number) {
  return new Intl.NumberFormat(
    "id-ID"
  ).format(value || 0);
}

export default function Dashboard() {
  const {
    data,
    loading,
    error,
  } = useDashboard();

  const cards = [
    {
      title: "Total Halaman",
      value:
        data?.totals.pages ?? 0,
      subtitle: "Halaman",
      Icon: Monitor,
    },
    {
      title: "Total Pesan",
      value:
        data?.totals.messages ?? 0,
      subtitle: "Pesan",
      Icon: MessageCircle,
    },
    {
      title: "Total Service",
      value:
        data?.totals.services ?? 0,
      subtitle: "Services",
      Icon: Laptop,
    },
    {
      title: "Total Produk",
      value:
        data?.totals.products ?? 0,
      subtitle: "Produk",
      Icon: BadgeCheck,
    },
  ];

  const chart =
    data?.chart ?? [];

  const points = useMemo(() => {
    const max = Math.max(
      1,
      ...chart.flatMap((item) => [
        item.visitors,
        item.pageViews,
      ])
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
              chart.length <= 1
                ? 40
                : 40 +
                  (610 *
                    index) /
                    (chart.length -
                      1);

            const y =
              240 -
              (190 *
                item[key]) /
                max;

            return `${x},${y}`;
          }
        )
        .join(" ");
    }

    return {
      visitors:
        make("visitors"),
      pageViews:
        make("pageViews"),
    };
  }, [chart]);

  return (
    <>
      <div
        className={
          styles.pageHeader
        }
      >
        <div>
          <h1>
            Dashboard
          </h1>

          <p>
            Data berikut
            diambil langsung
            dari API backend.
          </p>
        </div>
      </div>

      {error && (
        <div
          className={
            styles.errorBox
          }
        >
          {error}
        </div>
      )}

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
            <div
              className={
                styles.statCard
              }
              key={title}
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
                  />
                </span>

                <div>
                  <b>
                    {title}
                  </b>

                  <strong>
                    {loading
                      ? "..."
                      : fmt(
                          value
                        )}
                  </strong>

                  <small>
                    {
                      subtitle
                    }
                  </small>
                </div>
              </div>

              {(error || loading) && (
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
            </div>
          )
        )}
      </div>

      <div
        className={
          styles.dashboardGrid
        }
      >
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
            <h2>
              Visitor
            </h2>

            <button
              type="button"
              disabled
            >
              7 Hari Terakhir
            </button>
          </div>

          <div
            className={
              styles.metrics
            }
          >
            <div>
              <span>
                ● Total
                Visitor
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

            <div>
              <span>
                ● Page Views
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

          <div
            className={
              styles.chart
            }
          >
            <svg
              viewBox="0 0 700 300"
              preserveAspectRatio="none"
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
                  (y) => (
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

            <div
              className={
                styles.chartLabels
              }
            >
              {chart.map(
                (item) => (
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
                        day: "2-digit",
                        month:
                          "short",
                      }
                    )}
                  </span>
                )
              )}
            </div>
          </div>

          <div
            className={
              styles.legend
            }
          >
            <span>
              ● Total Visitor
            </span>

            <span>
              ● Page Views
            </span>
          </div>
        </section>

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
            <h2>
              Last Update
            </h2>
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