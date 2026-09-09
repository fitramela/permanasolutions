"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ExternalLink,
} from "lucide-react";

import {
  adminFetch,
} from "../api";

import {
  configs,
  serviceEditorItems,
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

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
};

export default function ContentEditor({
  slug,
  adminLocale = "id",
}: {
  slug: string;
  adminLocale?: string;
}) {
  /* =========================================================
     SERVICE
  ========================================================= */

  const isServiceGroup =
    slug ===
    "service";

  const [
    servicePage,
    setServicePage,
  ] =
    useState(
      "asp"
    );

  const effectiveSlug =
    isServiceGroup
      ? servicePage
      : slug;

  const config =
    configs[
      effectiveSlug
    ] ??
    configs.home;

  const pageSlug =
    config.pageSlug;

  /* =========================================================
     LOCALE
  ========================================================= */

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

  /* =========================================================
     TABS
  ========================================================= */

  const sectionTabs =
    config.namespaces ??
    [];

  const masterTabs =
    config.masters ??
    [];

  const allTabs =
    useMemo(
      () => [
        ...sectionTabs,
        ...masterTabs,
      ],
      [
        sectionTabs,
        masterTabs,
      ]
    );

  const [
    active,
    setActive,
  ] =
    useState(
      allTabs[0] ??
      ""
    );

  useEffect(() => {
    setActive(
      allTabs[0] ??
      ""
    );
  }, [
    effectiveSlug,
  ]);

  useEffect(() => {
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
    allTabs,
    active,
  ]);

  /* =========================================================
     SECTION
  ========================================================= */

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

  /* =========================================================
     MASTER
  ========================================================= */

  const isMasterTab =
    masterTabs.includes(
      active as
        MasterType
    );

  const isClientsEditor =
    effectiveSlug ===
      "clients" &&
    active ===
      "clients";

  /* =========================================================
     LOAD PAGE
  ========================================================= */

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
          error instanceof Error
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

  /* =========================================================
     ACTIVE SECTION
  ========================================================= */

  useEffect(() => {
    if (
      !active ||
      isMasterTab
    ) {
      return;
    }

    const stored =
      pageSections.find(
        (
          section
        ) =>
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
      stored?.is_active ??
        true
    );

    setMessage("");
  }, [
    active,
    contentLocale,
    pageSections,
    isMasterTab,
  ]);

  /* =========================================================
     WEBSITE
  ========================================================= */

  const websiteHref =
    `/${contentLocale}${config.website}`;

  const hasTabs =
    allTabs.length >
    0;

  function handleSaved(
    section:
      PageSection
  ) {
    setPageSections(
      (
        current
      ) => {
        const next =
          current.filter(
            (
              existing
            ) =>
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

  const pageTitle =
    isServiceGroup
      ? "Service"
      : config.title;

  const pageDescription =
    isServiceGroup
      ? "Kelola halaman dan data layanan dari satu tempat."
      : "Edit teks, gambar, daftar item, dan konten website dari halaman ini.";

  /* =========================================================
     ACTIVE CONTENT
  ========================================================= */

  const renderEditor =
    () => {
      if (
        isClientsEditor
      ) {
        return (
          <ClientsEditor
            locale={
              contentLocale
            }
          />
        );
      }

      if (
        isMasterTab
      ) {
        return (
          <MasterEditor
            type={
              active as
                MasterType
            }
            locale={
              contentLocale
            }
            serviceFilter={
              config.productService
            }
          />
        );
      }

      if (
        active
      ) {
        return (
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
        );
      }

      return (
        <div
          className={
            styles.emptyState
          }
        >
          Belum ada konten.
        </div>
      );
    };

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
          › {pageTitle}
        </strong>
      </div>

      {/* HEADER */}

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
            {pageTitle}
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            {pageDescription}
          </p>
        </div>

        {config.website !==
          undefined && (
          <a
            className={
              styles.secondaryIconButton
            }
            href={
              websiteHref
            }
            target="_blank"
            rel="noreferrer"
            aria-label="Lihat website"
            title="Lihat website"
          >
            <ExternalLink
              size={18}
            />
          </a>
        )}
      </div>

      {/* LOCALE */}

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

      {/* SERVICE */}

      {isServiceGroup ? (
        <div
          className={
            styles.editorLayout
          }
        >
          <aside
            className={
              styles.sectionNav
            }
          >
            {serviceEditorItems.map(
              (
                item
              ) => (
                <button
                  key={
                    item.key
                  }
                  type="button"
                  onClick={() =>
                    setServicePage(
                      item.key
                    )
                  }
                  className={
                    servicePage ===
                    item.key
                      ? styles.activeSection
                      : ""
                  }
                >
                  <span>
                    {item.label}
                  </span>

                  <span>
                    ›
                  </span>
                </button>
              )
            )}
          </aside>

          <div
            className={
              styles.serviceEditorArea
            }
          >
            {hasTabs &&
              allTabs.length >
                1 && (
                <div
                  className={
                    styles.serviceInnerNav
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
                            ? styles.serviceInnerActive
                            : ""
                        }
                      >
                        {namespace}
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
                            ? styles.serviceInnerActive
                            : ""
                        }
                      >
                        {masterLabel(
                          type
                        )}
                      </button>
                    )
                  )}
                </div>
              )}

            {renderEditor()}
          </div>
        </div>
      ) : !hasTabs ? (
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
                    {namespace}
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

          {renderEditor()}
        </div>
      )}
    </>
  );
}