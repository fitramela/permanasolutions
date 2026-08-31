"use client";

import { useSeo } from "@/app/hooks/admin/useSeo";

import type {
  PageItem,
} from "../types";

import ErrorBox from "../shared/ErrorBox";
import LoadingState from "../shared/LoadingState";
import SectionHeader from "../shared/SectionHeader";
import SuccessBox from "../shared/SuccessBox";

import styles from "@/app/styles/admin/AdminUI.module.css";

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
  } = useSeo();

  return (
    <>
      <SectionHeader
        title="SEO"
        desc="Atur meta title dan meta description setiap halaman website."
      />

      <ErrorBox
        message={error}
      />

      <SuccessBox
        message={message}
      />

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

        {loading ? (
          <LoadingState />
        ) : (
          <div
            className={
              styles.formGrid
            }
          >
            <div
              className={
                styles.field
              }
            >
              <label>
                Halaman
              </label>

              <select
                className={
                  styles.select
                }
                value={
                  selectedSlug
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

            <div
              className={
                styles.field
              }
            >
              <label>
                Bahasa
              </label>

              <select
                className={
                  styles.select
                }
                value={locale}
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

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Meta Title
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.meta_title ??
                  ""
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
            </div>

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Meta Description
              </label>

              <textarea
                className={
                  styles.textarea
                }
                value={
                  form.meta_description ??
                  ""
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
              styles.primaryButton
            }
            onClick={save}
            disabled={
              saving ||
              loading ||
              !selectedSlug
            }
          >
            {saving
              ? "Menyimpan..."
              : "Simpan SEO"}
          </button>
        </div>
      </section>
    </>
  );
}