"use client";

import {
  useMediaUpload,
} from "@/app/hooks/admin/useMediaUpload";

import ErrorBox from "../shared/ErrorBox";
import SectionHeader from "../shared/SectionHeader";
import SuccessBox from "../shared/SuccessBox";

import styles from "@/app/styles/admin/AdminUI.module.css";

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
              Pilih gambar kemudian upload ke penyimpanan website.
            </p>
          </div>
        </div>

        <div
          className={
            styles.formGrid
          }
        >

          {/* ================= FILE ================= */}

          <div
            className={`${styles.field} ${styles.full}`}
          >
            <label>
              Pilih Gambar
            </label>

            <input
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
          </div>

          {/* ================= PREVIEW ================= */}

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

          {/* ================= URL ================= */}

          {uploadedUrl && (
            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                URL Gambar
              </label>

              <input
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
              styles.primaryButton
            }
            disabled={
              uploading ||
              !file
            }
            onClick={
              upload
            }
          >
            {uploading
              ? "Mengupload..."
              : "Upload"}
          </button>
        </div>

      </section>

    </>
  );
}