"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/app/components/admin/api";

export type MessageItem = {
  id?: number | string;
  full_name?: string;
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  message?: string;
  status?: string;
  source?: string;
  created_at?: string;
};

export function useMessages() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminFetch<{ success: boolean; data: MessageItem[] }>(
        "/dashboard/messages"
      );
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setMessages([]);
      setError(error instanceof Error ? error.message : "Gagal mengambil pesan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { messages, loading, error, refetch };
}
