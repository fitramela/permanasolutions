"use client";

import {
  Save,
  Upload,
} from "lucide-react";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
};

/* =========================================================
   MESSAGES
========================================================= */

export function Messages() {
  return (
    <>
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
            Pesan Masuk
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            Pesan dari formulir website
            akan tampil di sini.
          </p>
        </div>
      </div>

      <div
        className={
          styles.emptyState
        }
      >
        Belum ada pesan masuk.
      </div>
    </>
  );
}

/* =========================================================
   MEDIA
========================================================= */

export function Media() {
  return (
    <>
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
            Media Library
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            Kelola gambar dan
            dokumen website.
          </p>
        </div>

        <button
          type="button"
          className={
            styles.primaryIconButton
          }
          aria-label="Upload file"
          title="Upload file"
        >
          <Upload
            size={19}
          />
        </button>
      </div>

      <div
        className={
          styles.mediaGrid
        }
      >
        <div
          className={
            styles.emptyState
          }
        >
          Belum ada file media.
        </div>
      </div>
    </>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

export function Settings() {
  const settingItems = [
    "Identitas Website",
    "Informasi Perusahaan",
    "Media Sosial",
    "SEO",
    "Bahasa",
  ];

  return (
    <>
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
            Pengaturan Website
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            Atur identitas,
            informasi perusahaan,
            media sosial,
            bahasa, dan SEO.
          </p>
        </div>
      </div>

      <div
        className={
          styles.settingsGrid
        }
      >
        {/* SETTING NAV */}

        <aside
          className={
            styles.settingMenu
          }
        >
          {settingItems.map(
            (
              item
            ) => (
              <button
                key={
                  item
                }
                type="button"
              >
                {item}
              </button>
            )
          )}
        </aside>

        {/* EDITOR */}

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
                Identitas Website
              </h2>

              <p>
                Isi data branding
                utama website.
              </p>
            </div>
          </div>

          <div
            className={
              styles.formGrid
            }
          >
            {/* WEBSITE NAME */}

            <div
              className={
                styles.field
              }
            >
              <label>
                Nama website
              </label>

              <input
                className={
                  styles.input
                }
                placeholder="Masukkan nama website"
              />
            </div>

            {/* LEGAL NAME */}

            <div
              className={
                styles.field
              }
            >
              <label>
                Nama legal
              </label>

              <input
                className={
                  styles.input
                }
                placeholder="Masukkan nama legal perusahaan"
              />
            </div>

            {/* DESCRIPTION */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Deskripsi website
              </label>

              <textarea
                className={
                  styles.textarea
                }
                placeholder="Masukkan deskripsi website"
              />
            </div>

            {/* LOGO */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Logo utama
              </label>

              <label
                className={
                  styles.upload
                }
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                />

                <span
                  className={
                    styles.uploadContent
                  }
                >
                  <Upload
                    size={20}
                  />

                  <strong>
                    Pilih logo
                  </strong>
                </span>
              </label>
            </div>
          </div>

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
              aria-label="Simpan pengaturan"
              title="Simpan pengaturan"
            >
              <Save
                size={18}
              />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}