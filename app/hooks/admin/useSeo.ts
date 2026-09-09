"use client";

import {
  useEffect,
  useState,
} from "react";

import { adminFetch } from "@/app/components/admin/api";

import type {
  AnyObject,
} from "@/app/components/admin/types";

import {
  getData,
} from "@/app/components/admin/utils";

export function useSeo() {
  const [
    selectedSlug,
    setSelectedSlug,
  ] = useState("home");

  const [
    locale,
    setLocale,
  ] = useState("id");

  const [form, setForm] =
    useState<AnyObject>({
      meta_title: "",
      meta_description: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    async function loadMeta() {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const response =
          await adminFetch<any>(
            `/cms/pages/${selectedSlug}?locale=${locale}`
          );

        const data =
          getData<any>(
            response
          );

        setForm({
          meta_title:
            data?.meta_title ??
            "",
          meta_description:
            data?.meta_description ??
            "",
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data SEO."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMeta();
  }, [
    selectedSlug,
    locale,
  ]);

  function update(
    field: string,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function save() {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await adminFetch(
        `/cms/pages/${selectedSlug}/meta?locale=${locale}`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...form,
            locale,
          }),
        }
      );

      setMessage(
        "SEO berhasil disimpan."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan SEO."
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    selectedSlug,
    setSelectedSlug,

    locale,
    setLocale,

    form,
    update,

    loading,
    saving,
    error,
    message,

    save,
  };
}