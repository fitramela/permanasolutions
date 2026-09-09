  "use client";

  import { useEffect, useState } from "react";
  import { adminFetch } from "@/app/components/admin/api";
  import type { AnyObject } from "@/app/components/admin/types";

  export function useSettingsForm(key: string, initialValue: AnyObject) {
    const [form, setForm] = useState<AnyObject>(initialValue);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      async function load() {
        try {
          setLoading(true);
          setError("");
          const response = await adminFetch<any>("/cms/settings");
          const root = response?.data ?? response ?? {};
          let value = root?.[key] ?? root?.settings?.[key] ?? {};
          if (Array.isArray(root)) {
            value = root.find((item: any) => item?.setting_key === key)?.value ?? {};
          }
          if (value && typeof value === "object" && !Array.isArray(value)) {
            setForm((prev) => ({ ...prev, ...value }));
          }
        } catch (e: any) {
          setError(e?.message ?? "Gagal mengambil pengaturan.");
        } finally {
          setLoading(false);
        }
      }
      void load();
    }, [key]);

    function update(field: string, value: string) {
      setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function save(successMessage: string) {
      try {
        setSaving(true);
        setError("");
        setMessage("");
        await adminFetch(`/cms/settings/${key}`, {
          method: "PUT",
          body: JSON.stringify({ value: form }),
        });
        setMessage(successMessage);
      } catch (e: any) {
        setError(e?.message ?? "Gagal menyimpan pengaturan.");
      } finally {
        setSaving(false);
      }
    }

    return { form, update, error, message, loading, saving, save };
  }
