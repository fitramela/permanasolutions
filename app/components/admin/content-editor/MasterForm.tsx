"use client";

import {
  type ChangeEvent,
} from "react";

import {
  adminFetch,
} from "../api";

import formStyles from "@/app/styles/admin/AdminForm.module.css";

const styles = {
  ...formStyles,
};
import {
  getUploadUrl,
  getYoutubeEmbedUrl,
} from "./helpers";

import type {
  MasterItem,
  MasterType,
} from "./types";

type Props = {
  type:
    MasterType;

  form:
    MasterItem;

  setForm:
    React.Dispatch<
      React.SetStateAction<MasterItem>
    >;

  localeLabel?:
    string;

  serviceFilter?:
    string;
};

export default function MasterForm({
  type,
  form,
  setForm,
  localeLabel,
  serviceFilter,
}: Props) {
  /**
   * =====================================================
   * UPDATE NORMAL
   * =====================================================
   */
  function update(
    key: string,
    value: any
  ) {
    setForm(
      (current) => ({
        ...current,

        [key]:
          value,
      })
    );
  }

  /**
   * =====================================================
   * UPDATE META
   * =====================================================
   */
  function updateMeta(
    key: string,
    value: any
  ) {
    setForm(
      (current) => {
        const currentMeta =
          current.meta &&
          typeof current.meta ===
            "object" &&
          !Array.isArray(
            current.meta
          )
            ? current.meta
            : {};

        return {
          ...current,

          meta: {
            ...currentMeta,

            [key]:
              value,
          },
        };
      }
    );
  }

  /**
   * =====================================================
   * UPLOAD IMAGE
   * =====================================================
   */
  async function upload(
    event:
      ChangeEvent<HTMLInputElement>,

    key:
      | "logo_url"
      | "photo_url"
      | "image_url"
  ) {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    try {
      const formData =
        new FormData();

      /**
       * PENTING:
       *
       * Backend:
       * upload.single("file")
       */
      formData.append(
        "file",
        file
      );

      const response =
        await adminFetch<any>(
          "/upload/image",
          {
            method:
              "POST",

            body:
              formData,
          }
        );

      const url =
        getUploadUrl(
          response
        );

      if (!url) {
        throw new Error(
          "URL gambar tidak ditemukan."
        );
      }

      update(
        key,
        url
      );
    } catch (error) {
      console.error(
        "Upload image failed:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Upload gambar gagal."
      );
    } finally {
      event.target.value =
        "";
    }
  }

  /**
   * =====================================================
   * IMAGE KEY
   * =====================================================
   */
  const imageKey:
    | "logo_url"
    | "photo_url"
    | "image_url" =
    type === "clients" ||
    type ===
      "technologies"
      ? "logo_url"
      : type === "team"
        ? "photo_url"
        : "image_url";

  /**
   * =====================================================
   * ASP PRODUCT
   * =====================================================
   */
  const activeService =
    String(
      serviceFilter ??
      form.service ??
      ""
    )
      .trim()
      .toLowerCase();

  const isAspProduct =
    type ===
      "products" &&
    activeService ===
      "asp";

  
  const existingYoutube =
    typeof form.meta
      ?.youtube_url ===
      "string"
      ? form.meta
          .youtube_url
      : "";

  const savedMediaType =
    typeof form.meta
      ?.media_type ===
      "string"
      ? form.meta
          .media_type
      : "";

  const mediaType:
    "image" |
    "youtube" =
    savedMediaType ===
      "youtube"
      ? "youtube"
      : savedMediaType ===
          "image"
        ? "image"
        : existingYoutube
          ? "youtube"
          : "image";

  const youtubeUrl =
    existingYoutube;

  const youtubePreview =
    getYoutubeEmbedUrl(
      youtubeUrl
    );

  /**
   * =====================================================
   * CHANGE MEDIA SOURCE
   * =====================================================
   */
  function changeMediaType(
    value:
      "image" |
      "youtube"
  ) {
    updateMeta(
      "media_type",
      value
    );

    /**
     * Jangan hapus image_url ataupun
     * youtube_url ketika berpindah.
     *
     * Supaya kalau admin kembali memilih
     * source sebelumnya, data lama
     * masih tersedia.
     */
  }

  return (
    <div>

      {/* ================= LANGUAGE ================= */}

      {localeLabel && (
        <div
          className={
            styles.languageTitle
          }
        >
          {localeLabel}
        </div>
      )}

      <div
        className={
          styles.formGrid
        }
      >

        {/* ================= NAME ================= */}

        <div
          className={
            styles.field
          }
        >
          <label>
            Nama
          </label>

          <input
            className={
              styles.input
            }
            value={
              form.name ??
              ""
            }
            onChange={(
              event
            ) =>
              update(
                "name",
                event.target
                  .value
              )
            }
          />
        </div>

        {/* =================================================
            CLIENT
        ================================================= */}

        {type ===
          "clients" && (
          <>
            <div
              className={
                styles.field
              }
            >
              <label>
                Industry
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.industry ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  update(
                    "industry",
                    event.target
                      .value
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
                Placement
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.placement ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  update(
                    "placement",
                    event.target
                      .value
                  )
                }
              />
            </div>
          </>
        )}

        {/* =================================================
            TEAM
        ================================================= */}

        {type ===
          "team" && (
          <>
            <div
              className={
                styles.field
              }
            >
              <label>
                Position
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.position ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  update(
                    "position",
                    event.target
                      .value
                  )
                }
              />
            </div>

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Bio
              </label>

              <textarea
                className={
                  styles.textarea
                }
                value={
                  form.bio ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  update(
                    "bio",
                    event.target
                      .value
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
                LinkedIn
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.linkedin_url ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  update(
                    "linkedin_url",
                    event.target
                      .value
                  )
                }
              />
            </div>
          </>
        )}

        {/* =================================================
            TECHNOLOGIES
        ================================================= */}

        {type ===
          "technologies" && (
          <div
            className={
              styles.field
            }
          >
            <label>
              Category
            </label>

            <input
              className={
                styles.input
              }
              value={
                form.category ??
                ""
              }
              onChange={(
                event
              ) =>
                update(
                  "category",
                  event.target
                    .value
                )
              }
            />
          </div>
        )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {type ===
          "products" && (
          <>
            {/* SERVICE */}

            <div
              className={
                styles.field
              }
            >
              <label>
                Service
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.service ??
                  ""
                }
                readOnly={
                  isAspProduct
                }
                onChange={(
                  event
                ) =>
                  update(
                    "service",
                    event.target
                      .value
                  )
                }
              />
            </div>

            {/* CATEGORY */}

            <div
              className={
                styles.field
              }
            >
              <label>
                Category
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.category ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  update(
                    "category",
                    event.target
                      .value
                  )
                }
              />
            </div>

            {/* DESCRIPTION */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Description
              </label>

              <textarea
                className={
                  styles.textarea
                }
                value={
                  form.description ??
                  ""
                }
                onChange={(
                  event
                ) =>
                  update(
                    "description",
                    event.target
                      .value
                  )
                }
              />
            </div>

            {/* =============================================
                MEDIA ASP
            ============================================= */}

            {isAspProduct && (
              <div
                className={`${styles.field} ${styles.full}`}
              >
                <label>
                  Media
                </label>

                {/* SOURCE */}

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
                      Sumber Media
                    </label>

                    <select
                      className={
                        styles.select
                      }
                      value={
                        mediaType
                      }
                      onChange={(
                        event
                      ) =>
                        changeMediaType(
                          event.target
                            .value as
                            | "image"
                            | "youtube"
                        )
                      }
                    >
                      <option value="image">
                        Upload Gambar
                      </option>

                      <option value="youtube">
                        Link YouTube
                      </option>
                    </select>
                  </div>

                  {/* ================= IMAGE ================= */}

                  {mediaType ===
                    "image" && (
                    <div
                      className={
                        styles.field
                      }
                    >
                      <label>
                        File
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        className={
                          styles.fileInput
                        }
                        onChange={(
                          event
                        ) =>
                          upload(
                            event,
                            "image_url"
                          )
                        }
                      />
                    </div>
                  )}

                  {/* ================= YOUTUBE ================= */}

                  {mediaType ===
                    "youtube" && (
                    <div
                      className={
                        styles.field
                      }
                    >
                      <label>
                        Link
                      </label>

                      <input
                        type="url"
                        className={
                          styles.input
                        }
                        value={
                          youtubeUrl
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        onChange={(
                          event
                        ) =>
                          updateMeta(
                            "youtube_url",
                            event.target
                              .value
                          )
                        }
                      />
                    </div>
                  )}
                </div>

                {/* ================= PREVIEW ================= */}

                <div
                  className={
                    styles.field
                  }
                >
                  <label>
                    Preview
                  </label>

                  {mediaType ===
                    "image" ? (
                    form.image_url ? (
                      <div
                        className={
                          styles.mediaPreview
                        }
                      >
                        <img
                          src={
                            String(
                              form.image_url
                            )
                          }
                          alt={
                            form.name ??
                            "Preview"
                          }
                        />
                      </div>
                    ) : (
                      <small
                        className={
                          styles.help
                        }
                      >
                        Belum ada gambar.
                      </small>
                    )
                  ) : youtubePreview ? (
                    <div
                      style={{
                        position:
                          "relative",

                        width:
                          "100%",

                        maxWidth:
                          "640px",

                        aspectRatio:
                          "16 / 9",

                        overflow:
                          "hidden",

                        borderRadius:
                          "16px",
                      }}
                    >
                      <iframe
                        src={
                          youtubePreview
                        }
                        title={
                          form.name ??
                          "YouTube Preview"
                        }
                        style={{
                          position:
                            "absolute",

                          inset:
                            0,

                          width:
                            "100%",

                          height:
                            "100%",

                          border:
                            0,
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <small
                      className={
                        styles.help
                      }
                    >
                      Masukkan link YouTube untuk melihat preview.
                    </small>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {!isAspProduct && (
          <div
            className={`${styles.field} ${styles.full}`}
          >
            <label>
              {type ===
              "team"
                ? "Foto"
                : type ===
                    "products"
                  ? "Gambar"
                  : "Logo"}
            </label>

            {form[
              imageKey
            ] && (
              <div
                className={
                  styles.mediaPreview
                }
              >
                <img
                  src={
                    String(
                      form[
                        imageKey
                      ]
                    )
                  }
                  alt={
                    form.name ??
                    ""
                  }
                />
              </div>
            )}

            <input
              type="text"
              className={
                styles.input
              }
              value={
                form[
                  imageKey
                ] ?? ""
              }
              placeholder="/images/example.png"
              onChange={(
                event
              ) =>
                update(
                  imageKey,
                  event.target
                    .value
                )
              }
            />

            <input
              type="file"
              accept="image/*"
              className={
                styles.fileInput
              }
              onChange={(
                event
              ) =>
                upload(
                  event,
                  imageKey
                )
              }
            />
          </div>
        )}

        {/* ================= SORT ================= */}

        <div
          className={
            styles.field
          }
        >
          <label>
            Urutan
          </label>

          <input
            type="number"
            className={
              styles.input
            }
            value={
              form.sort_order ??
              0
            }
            onChange={(
              event
            ) =>
              update(
                "sort_order",
                Number(
                  event.target
                    .value
                )
              )
            }
          />
        </div>

        {/* ================= STATUS ================= */}

        <div
          className={
            styles.field
          }
        >
          <label>
            Status
          </label>

          <select
            className={
              styles.select
            }
            value={
              form.is_active
                ? "true"
                : "false"
            }
            onChange={(
              event
            ) =>
              update(
                "is_active",
                event.target
                  .value ===
                  "true"
              )
            }
          >
            <option value="true">
              Active
            </option>

            <option value="false">
              Inactive
            </option>
          </select>
        </div>

      </div>
    </div>
  );
}