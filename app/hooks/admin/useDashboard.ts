"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { adminFetch } from "@/app/components/admin/api";

export type DashboardData = {
  totals: {
    pages: number;
    messages: number;
    services: number;
    products: number;
    users: number;
  };

  totalVisitors: number;
  totalSessions: number;
  totalPageViews: number;

  chart: Array<{
    date: string;
    visitors: number;
    pageViews: number;
  }>;
};

export function useDashboard() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await adminFetch<{
            success: boolean;
            data: DashboardData;
          }>("/dashboard");

        if (!response.success) {
          throw new Error(
            "Gagal mengambil dashboard."
          );
        }

        setData(response.data);
      } catch (error) {
        setData(null);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil dashboard."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
}