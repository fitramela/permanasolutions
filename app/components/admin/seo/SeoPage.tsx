"use client";

import {
  LoaderCircle,
  Save,
} from "lucide-react";

import {
  useSeo,
} from "@/app/hooks/admin/useSeo";

import type {
  PageItem,
} from "../types";

import ErrorBox from "../shared/ErrorBox";
import LoadingState from "../shared/LoadingState";
import SectionHeader from "../shared/SectionHeader";
import SuccessBox from "../shared/SuccessBox";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
};

const pages: PageItem[] = [
  {
    slug: "home",
    title: "Home",
  },
  {
    slug: "solutions",
    title: "Solutions",
  },
  {
    slug: "about",
    title: "About",
  },
  {
    slug: "service",
    title: "Service",
  },
  {
    slug: "contact",
    title: "Contact",
  },
];

export default function SeoPage() {
  const {
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
  } =
    useSeo();

  return (
    <>
      {/* ================= HEADER ================= */}

      <SectionHeader
        title="SEO"
        desc="Atur meta title dan meta description setiap halaman website."
      />

      {/* ================= STATUS ================= */}

      <ErrorBox
        message={
          error
        }
      />

      <SuccessBox
        message={
          message
        }
      />

      {/* ================= CARD ================= */}

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
              Search Engine
              Optimization
            </h2>

            <p>
              Pengaturan
              informasi halaman
              yang tampil pada
              mesin pencari.
            </p>
          </div>
        </div>

        {/* ================= CONTENT ================= */}

        {loading ? (
          <LoadingState />
        ) : (
          <div
            className={
              styles.formGrid
            }
          >
            {/* PAGE */}

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="seo-page"
              >
                Halaman
              </label>

              <select
                id="seo-page"
                className={
                  styles.select
                }
                value={
                  selectedSlug
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  setSelectedSlug(
                    event.target
                      .value
                  )
                }
              >
                {pages.map(
                  (
                    page,
                    index
                  ) => (
                    <option
                      key={
                        page.id ??
                        page.slug ??
                        index
                      }
                      value={
                        page.slug ??
                        ""
                      }
                    >
                      {page.title ??
                        page.slug}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* LANGUAGE */}

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="seo-language"
              >
                Bahasa
              </label>

              <select
                id="seo-language"
                className={
                  styles.select
                }
                value={
                  locale
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  setLocale(
                    event.target
                      .value
                  )
                }
              >
                <option value="id">
                  Indonesia
                </option>

                <option value="en">
                  English
                </option>
              </select>
            </div>

            {/* META TITLE */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="seo-meta-title"
              >
                Meta Title
              </label>

              <input
                id="seo-meta-title"
                className={
                  styles.input
                }
                value={
                  form.meta_title ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "meta_title",
                    event.target
                      .value
                  )
                }
                placeholder="Judul halaman untuk Google"
              />

              <small
                className={
                  styles.help
                }
              >
                Buat judul yang jelas, relevan, dan ringkas untuk hasil pencarian.
              </small>
            </div>

            {/* META DESCRIPTION */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="seo-meta-description"
              >
                Meta Description
              </label>

              <textarea
                id="seo-meta-description"
                className={
                  styles.textarea
                }
                value={
                  form.meta_description ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "meta_description",
                    event.target
                      .value
                  )
                }
                placeholder="Deskripsi singkat halaman..."
              />

              <small
                className={
                  styles.help
                }
              >
                Gunakan deskripsi singkat yang menjelaskan isi halaman.
              </small>
            </div>
          </div>
        )}

        {/* ================= ACTION ================= */}

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
            onClick={
              save
            }
            disabled={
              saving ||
              loading ||
              !selectedSlug
            }
            aria-label={
              saving
                ? "Sedang menyimpan SEO"
                : "Simpan SEO"
            }
            title={
              saving
                ? "Menyimpan..."
                : "Simpan SEO"
            }
          >
            {saving ? (
              <LoaderCircle
                size={18}
                strokeWidth={2}
                className={
                  styles.spin
                }
              />
            ) : (
              <Save
                size={18}
                strokeWidth={2}
              />
            )}
          </button>
        </div>
      </section>
    </>
  );
}