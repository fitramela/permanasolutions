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

const fields = [
  "instagram",
  "facebook",
  "linkedin",
  "youtube",
  "tiktok",
];

export default function SocialMediaPage() {
  const {
    form,
    update,
    error,
    message,
    loading,
    saving,
    save,
  } = useSettingsForm(
    "social_media",
    {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      tiktok: "",
    }
  );

  return (
    <>
      <SectionHeader
        title="Social Media"
        desc="Kelola seluruh akun social media Permana Solutions."
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
              Akun Social Media
            </h2>

            <p>
              Link ini dapat digunakan
              pada navbar, footer,
              dan halaman contact.
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
            {fields.map(
              (
                field
              ) => (
                <div
                  key={
                    field
                  }
                  className={
                    styles.field
                  }
                >
                  <label
                    htmlFor={`social-${field}`}
                  >
                    {field
                      .charAt(0)
                      .toUpperCase() +
                      field.slice(1)}
                  </label>

                  <input
                    id={`social-${field}`}
                    className={
                      styles.input
                    }
                    value={
                      form[field] ??
                      ""
                    }
                    disabled={
                      saving
                    }
                    placeholder={`https://${field}.com/...`}
                    onChange={(
                      event
                    ) =>
                      update(
                        field,
                        event.target.value
                      )
                    }
                  />
                </div>
              )
            )}
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
                "Social media berhasil disimpan."
              )
            }
            aria-label="Simpan social media"
            title="Simpan social media"
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