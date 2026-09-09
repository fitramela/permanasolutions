"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  LoaderCircle,
  Save,
} from "lucide-react";

import {
  adminFetch,
} from "../api";

import MasterEditor from "./MasterEditor";

import type {
  Locale,
  PageResponse,
} from "./types";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
};

type Props = {
  locale: Locale;
};

export default function ClientsEditor({
  locale,
}: Props) {
  const [
    idTitle,
    setIdTitle,
  ] =
    useState("");

  const [
    enTitle,
    setEnTitle,
  ] =
    useState("");

  const [
    idContent,
    setIdContent,
  ] =
    useState<
      Record<string, any>
    >({});

  const [
    enContent,
    setEnContent,
  ] =
    useState<
      Record<string, any>
    >({});

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  /* =========================================================
     LOAD TITLE
  ========================================================= */

  useEffect(() => {
    let cancelled =
      false;

    async function loadTitles() {
      try {
        setLoading(
          true
        );

        setError("");

        const [
          indonesia,
          english,
        ] =
          await Promise.all([
            adminFetch<PageResponse>(
              "/cms/pages/home?locale=id"
            ),

            adminFetch<PageResponse>(
              "/cms/pages/home?locale=en"
            ),
          ]);

        if (
          cancelled
        ) {
          return;
        }

        const idSection =
          indonesia.data
            ?.sections
            ?.find(
              (
                section
              ) =>
                section.section_key ===
                "Client"
            );

        const enSection =
          english.data
            ?.sections
            ?.find(
              (
                section
              ) =>
                section.section_key ===
                "Client"
            );

        const nextIdContent =
          idSection?.content ??
          {};

        const nextEnContent =
          enSection?.content ??
          {};

        setIdContent(
          nextIdContent
        );

        setEnContent(
          nextEnContent
        );

        setIdTitle(
          typeof nextIdContent
            .title ===
            "string"
            ? nextIdContent.title
            : ""
        );

        setEnTitle(
          typeof nextEnContent
            .title ===
            "string"
            ? nextEnContent.title
            : ""
        );
      } catch (error) {
        if (
          !cancelled
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "Gagal mengambil judul Clients."
          );
        }
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );
        }
      }
    }

    loadTitles();

    return () => {
      cancelled =
        true;
    };
  }, []);

  /* =========================================================
     SAVE
  ========================================================= */

  async function saveTitles() {
    try {
      setSaving(
        true
      );

      setError("");
      setMessage("");

      await Promise.all([
        adminFetch(
          "/cms/pages/home/sections/Client",
          {
            method:
              "PUT",

            body:
              JSON.stringify({
                locale:
                  "id",

                title:
                  "Client",

                content: {
                  ...idContent,
                  title:
                    idTitle,
                },

                is_active:
                  true,

                sort_order:
                  6,
              }),
          }
        ),

        adminFetch(
          "/cms/pages/home/sections/Client",
          {
            method:
              "PUT",

            body:
              JSON.stringify({
                locale:
                  "en",

                title:
                  "Client",

                content: {
                  ...enContent,
                  title:
                    enTitle,
                },

                is_active:
                  true,

                sort_order:
                  6,
              }),
          }
        ),
      ]);

      setMessage(
        "Perubahan berhasil disimpan."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
    <div
      className={
        styles.clientsEditorLayout
      }
    >
      <section
        className={
          styles.editorCard
        }
      >
        <div
          className={
            styles.editorHeader
          }
        >
          <div>
            <h2>
              Judul Clients
            </h2>

            <p>
              Atur judul section
              Clients untuk kedua bahasa.
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

        {message && (
          <div
            className={
              styles.successBox
            }
          >
            {message}
          </div>
        )}

        {loading ? (
          <div
            className={
              styles.loadingBox
            }
          >
            Memuat...
          </div>
        ) : (
          <div
            className={
              styles.clientTitleGrid
            }
          >
            <div
              className={
                styles.field
              }
            >
              <label>
                Indonesia
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  idTitle
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  setIdTitle(
                    event.target.value
                  )
                }
              />
            </div>

            <div
              className={
                styles.field
              }
            >
              <label>
                English
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  enTitle
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  setEnTitle(
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        )}

        <div
          className={
            styles.editorFooter
          }
        >
          <button
            type="button"
            className={
              styles.primaryIconButton
            }
            disabled={
              saving ||
              loading
            }
            onClick={
              saveTitles
            }
            aria-label="Simpan judul clients"
            title="Simpan"
          >
            {saving ? (
              <LoaderCircle
                size={18}
                className={
                  styles.spin
                }
              />
            ) : (
              <Save
                size={18}
              />
            )}
          </button>
        </div>
      </section>

      <MasterEditor
        type="clients"
        locale={
          locale
        }
      />
    </div>
  );
}