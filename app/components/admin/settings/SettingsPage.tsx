"use client";

import {
  LoaderCircle,
  Save,
} from "lucide-react";

import ErrorBox from "../shared/ErrorBox";
import LoadingState from "../shared/LoadingState";
import SectionHeader from "../shared/SectionHeader";
import SuccessBox from "../shared/SuccessBox";

import {
  useSettingsForm,
} from "@/app/hooks/admin/useSettingsForm";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
};

export default function SettingsPage() {
  const {
    form,
    update,
    error,
    message,
    loading,
    saving,
    save,
  } = useSettingsForm(
    "website",
    {
      company_name: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      logo_url: "",
      favicon_url: "",
      copyright: "",
    }
  );

  return (
    <>
      <SectionHeader
        title="Setting"
        desc="Kelola identitas dan informasi utama website."
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
              Informasi Website
            </h2>

            <p>
              Data identitas utama
              Permana Solutions.
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
            {/* COMPANY */}

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="company-name"
              >
                Nama Perusahaan
              </label>

              <input
                id="company-name"
                className={
                  styles.input
                }
                value={
                  form.company_name ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "company_name",
                    event.target.value
                  )
                }
              />
            </div>

            {/* EMAIL */}

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="company-email"
              >
                Email
              </label>

              <input
                id="company-email"
                className={
                  styles.input
                }
                type="email"
                value={
                  form.email ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "email",
                    event.target.value
                  )
                }
              />
            </div>

            {/* PHONE */}

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="company-phone"
              >
                Nomor Telepon
              </label>

              <input
                id="company-phone"
                className={
                  styles.input
                }
                value={
                  form.phone ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "phone",
                    event.target.value
                  )
                }
              />
            </div>

            {/* WHATSAPP */}

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="company-whatsapp"
              >
                WhatsApp
              </label>

              <input
                id="company-whatsapp"
                className={
                  styles.input
                }
                value={
                  form.whatsapp ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "whatsapp",
                    event.target.value
                  )
                }
              />
            </div>

            {/* ADDRESS */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="company-address"
              >
                Alamat
              </label>

              <textarea
                id="company-address"
                className={
                  styles.textarea
                }
                value={
                  form.address ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "address",
                    event.target.value
                  )
                }
              />
            </div>

            {/* LOGO */}

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="company-logo"
              >
                URL Logo
              </label>

              <input
                id="company-logo"
                className={
                  styles.input
                }
                value={
                  form.logo_url ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "logo_url",
                    event.target.value
                  )
                }
              />
            </div>

            {/* FAVICON */}

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="company-favicon"
              >
                URL Favicon
              </label>

              <input
                id="company-favicon"
                className={
                  styles.input
                }
                value={
                  form.favicon_url ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "favicon_url",
                    event.target.value
                  )
                }
              />
            </div>

            {/* COPYRIGHT */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="company-copyright"
              >
                Copyright Footer
              </label>

              <input
                id="company-copyright"
                className={
                  styles.input
                }
                value={
                  form.copyright ??
                  ""
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  update(
                    "copyright",
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
            onClick={() =>
              save(
                "Pengaturan website berhasil disimpan."
              )
            }
            aria-label="Simpan pengaturan"
            title="Simpan pengaturan"
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
    </>
  );
}