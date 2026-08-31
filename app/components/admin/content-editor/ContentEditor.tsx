"use client";

import {
  useEffect,
  useState,
} from "react";

import { adminFetch } from "../api";

import styles from "@/app/styles/admin/AdminUI.module.css";

import {
  configs,
} from "./config";

import {
  getDefaultSection,
  merge,
  masterLabel,
} from "./helpers";

import LocaleDropdown from "./LocaleDropdown";
import MasterEditor from "./MasterEditor";
import ClientsEditor from "./ClientsEditor";
import SectionEditor from "./SectionEditor";

import type {
  Locale,
  MasterType,
  PageResponse,
  PageSection,
  JsonObject,
} from "./types";

export default function ContentEditor({
  slug,
  adminLocale =
    "id",
}: {
  slug: string;
  adminLocale?: string;
}) {
  const config =
    configs[slug] ??
    configs.home;

  const pageSlug =
    config.pageSlug;

  const [
    contentLocale,
    setContentLocale,
  ] =
    useState<Locale>(
      adminLocale ===
        "en"
        ? "en"
        : "id"
    );

  const sectionTabs =
    config.namespaces ??
    [];

  const masterTabs =
    config.masters ??
    [];

  const initialActive =
    sectionTabs[0] ??
    masterTabs[0] ??
    "";

  const [
    active,
    setActive,
  ] =
    useState(
      initialActive
    );

  const [
    sectionContent,
    setSectionContent,
  ] =
    useState<JsonObject>(
      {}
    );

  const [
    sectionEnabled,
    setSectionEnabled,
  ] =
    useState(true);

  const [
    pageSections,
    setPageSections,
  ] =
    useState<
      PageSection[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

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

  const isMasterTab =
    masterTabs.includes(
      active as MasterType
    );

  /**
   * Home -> clients mempunyai
   * editor khusus:
   *
   * Client section title
   * +
   * clients master
   */
  const isHomeClients =
    slug === "home" &&
    active ===
      "clients";

  /**
   * RESET TAB
   */
  useEffect(() => {
    const allTabs = [
      ...sectionTabs,
      ...masterTabs,
    ];

    if (
      allTabs.length ===
      0
    ) {
      setActive("");

      return;
    }

    if (
      !allTabs.includes(
        active as any
      )
    ) {
      setActive(
        allTabs[0]
      );
    }
  }, [
    slug,
    active,
    sectionTabs,
    masterTabs,
  ]);

  /**
   * LOAD PAGE SECTION
   */
  useEffect(() => {
    let cancelled =
      false;

    async function loadPage() {
      if (
        isMasterTab ||
        !active
      ) {
        return;
      }

      try {
        setLoading(
          true
        );

        setError("");
        setMessage("");

        const response =
          await adminFetch<PageResponse>(
            `/cms/pages/${pageSlug}?locale=${encodeURIComponent(
              contentLocale
            )}`
          );

        if (
          cancelled
        ) {
          return;
        }

        setPageSections(
          response.data
            ?.sections ??
            []
        );
      } catch (error) {
        if (
          cancelled
        ) {
          return;
        }

        setPageSections(
          []
        );

        setError(
          error instanceof
            Error
            ? error.message
            : "Gagal mengambil konten CMS."
        );
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

    loadPage();

    return () => {
      cancelled =
        true;
    };
  }, [
    pageSlug,
    contentLocale,
    active,
    isMasterTab,
  ]);

  /**
   * LOAD ACTIVE SECTION
   */
  useEffect(() => {
    if (
      !active ||
      isMasterTab
    ) {
      return;
    }

    const stored =
      pageSections.find(
        (section) =>
          section.section_key ===
          active
      );

    const defaults =
      getDefaultSection(
        contentLocale,
        active
      );

    setSectionContent(
      stored?.content
        ? merge(
            defaults,
            stored.content
          )
        : defaults
    );

    setSectionEnabled(
      stored
        ?.is_active ??
        true
    );

    setMessage("");
  }, [
    active,
    contentLocale,
    pageSections,
    isMasterTab,
  ]);

  const websiteHref =
    `/${contentLocale}${config.website}`;

  const hasTabs =
    sectionTabs.length >
      0 ||
    masterTabs.length >
      0;

  function handleSaved(
    section:
      PageSection
  ) {
    setPageSections(
      (current) => {
        const next =
          current.filter(
            (existing) =>
              existing.section_key !==
              section.section_key
          );

        return [
          ...next,
          section,
        ].sort(
          (
            a,
            b
          ) =>
            (
              a.sort_order ??
              0
            ) -
            (
              b.sort_order ??
              0
            )
        );
      }
    );
  }

  return (
    <>

      {/* BREADCRUMB */}

      <div
        className={
          styles.breadcrumb
        }
      >
        <span>
          Dashboard
        </span>

        <span>
          › Content
        </span>

        <strong>
          › {config.title}
        </strong>
      </div>

      {/* HEADER */}

      <div
        className={
          styles.pageHeader
        }
      >
        <div>
          <h1>
            {config.title}
          </h1>

          <p>
            Edit teks,
            gambar, daftar
            item, dan konten
            website dari
            halaman ini.
          </p>
        </div>

        <a
          className={
            styles.websiteButton
          }
          href={
            websiteHref
          }
          target="_blank"
          rel="noreferrer"
        >
          Lihat Website ↗
        </a>
      </div>

      {/* ================= LOCALE DROPDOWN ================= */}

      <div
        className={
          styles.localeBar
        }
      >
        <LocaleDropdown
          value={
            contentLocale
          }
          onChange={
            setContentLocale
          }
          disabled={
            loading
          }
        />

        {loading && (
          <small>
            Memuat CMS...
          </small>
        )}
      </div>

      {!hasTabs ? (
        <div
          className={
            styles.emptyState
          }
        >
          Halaman ini belum
          memiliki konten yang
          terhubung ke CMS.
        </div>
      ) : (

        <div
          className={
            styles.editorLayout
          }
        >

          {/* SIDEBAR */}

          <aside
            className={
              styles.sectionNav
            }
          >

            {sectionTabs.map(
              (
                namespace
              ) => (
                <button
                  key={
                    namespace
                  }
                  type="button"
                  onClick={() =>
                    setActive(
                      namespace
                    )
                  }
                  className={
                    active ===
                    namespace
                      ? styles.activeSection
                      : ""
                  }
                >
                  <span>
                    {
                      namespace
                    }
                  </span>

                  <span>
                    ›
                  </span>
                </button>
              )
            )}

            {masterTabs.map(
              (
                type
              ) => (
                <button
                  key={
                    type
                  }
                  type="button"
                  onClick={() =>
                    setActive(
                      type
                    )
                  }
                  className={
                    active ===
                    type
                      ? styles.activeSection
                      : ""
                  }
                >
                  <span>
                    {masterLabel(
                      type
                    )}
                  </span>

                  <span>
                    ›
                  </span>
                </button>
              )
            )}

          </aside>

          {/* ================= CONTENT ================= */}

          {isHomeClients ? (

            /**
             * HOME CLIENTS:
             *
             * Client title
             * +
             * clients master
             */
            <ClientsEditor
              locale={
                contentLocale
              }
            />

          ) : isMasterTab ? (

            /**
             * MASTER DATA:
             *
             * popup bilingual
             */
            <MasterEditor
              type={
                active as MasterType
              }
              locale={
                contentLocale
              }
            />

          ) : (

            /**
             * NORMAL CMS SECTION
             */
            <SectionEditor
              pageSlug={
                pageSlug
              }
              active={
                active
              }
              locale={
                contentLocale
              }
              sectionContent={
                sectionContent
              }
              setSectionContent={
                setSectionContent
              }
              sectionEnabled={
                sectionEnabled
              }
              setSectionEnabled={
                setSectionEnabled
              }
              sectionTabs={
                sectionTabs
              }
              websiteHref={
                websiteHref
              }
              saving={
                saving
              }
              setSaving={
                setSaving
              }
              error={
                error
              }
              setError={
                setError
              }
              message={
                message
              }
              setMessage={
                setMessage
              }
              onSaved={
                handleSaved
              }
            />

          )}

        </div>
      )}

    </>
  );
}