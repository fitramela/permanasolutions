"use client";

import {
  Image,
  LoaderCircle,
  Upload,
} from "lucide-react";

import {
  useMediaUpload,
} from "@/app/hooks/admin/useMediaUpload";

import ErrorBox from "../shared/ErrorBox";
import SectionHeader from "../shared/SectionHeader";
import SuccessBox from "../shared/SuccessBox";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
};

export default function MediaPage() {
  const {
    file,
    preview,
    uploadedUrl,
    uploading,
    error,
    message,
    selectFile,
    upload,
  } =
    useMediaUpload();

  return (
    <>
      {/* ================= HEADER ================= */}

      <SectionHeader
        title="Media"
        desc="Upload gambar yang akan digunakan pada konten website."
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
              Upload Media
            </h2>

            <p>
              Pilih gambar
              kemudian upload
              ke penyimpanan
              website.
            </p>
          </div>

          <span
            className={
              styles.editorHeaderIcon
            }
            aria-hidden="true"
          >
            <Image
              size={22}
              strokeWidth={1.8}
            />
          </span>
        </div>

        {/* ================= FORM ================= */}

        <div
          className={
            styles.formGrid
          }
        >
          {/* FILE */}

          <div
            className={`${styles.field} ${styles.full}`}
          >
            <label
              htmlFor="media-file"
            >
              Pilih Gambar
            </label>

            <input
              id="media-file"
              className={
                styles.fileInput
              }
              type="file"
              accept="image/*"
              disabled={
                uploading
              }
              onChange={(
                event
              ) =>
                selectFile(
                  event.target
                    .files?.[0] ??
                    null
                )
              }
            />

            <small
              className={
                styles.help
              }
            >
              Gunakan format JPG, JPEG, PNG, atau WebP sesuai kebutuhan website.
            </small>
          </div>

          {/* PREVIEW */}

          {preview && (
            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Preview
              </label>

              <div
                className={
                  styles.mediaPreview
                }
              >
                <img
                  src={
                    preview
                  }
                  alt="Preview upload"
                />
              </div>
            </div>
          )}

          {/* URL */}

          {uploadedUrl && (
            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="uploaded-url"
              >
                URL Gambar
              </label>

              <input
                id="uploaded-url"
                className={
                  styles.input
                }
                value={
                  uploadedUrl
                }
                readOnly
              />
            </div>
          )}
        </div>

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
            disabled={
              uploading ||
              !file
            }
            onClick={
              upload
            }
            aria-label={
              uploading
                ? "Sedang mengupload"
                : "Upload gambar"
            }
            title={
              uploading
                ? "Mengupload..."
                : "Upload"
            }
          >
            {uploading ? (
              <LoaderCircle
                size={19}
                strokeWidth={2}
                className={
                  styles.spin
                }
              />
            ) : (
              <Upload
                size={19}
                strokeWidth={2}
              />
            )}
          </button>
        </div>
      </section>
    </>
  );
}