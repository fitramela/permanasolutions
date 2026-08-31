"use client";

import {
  type ChangeEvent,
} from "react";

import { adminFetch } from "../api";

import styles from "@/app/styles/admin/AdminUI.module.css";

import {
  getUploadUrl,
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

  localeLabel?: string;
};

export default function MasterForm({
  type,
  form,
  setForm,
  localeLabel,
}: Props) {
  function update(
    key: string,
    value: any
  ) {
    setForm(
      (
        current
      ) => ({
        ...current,

        [key]:
          value,
      })
    );
  }

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
        error instanceof
          Error
          ? error.message
          : "Upload gambar gagal."
      );
    } finally {
      event.target.value =
        "";
    }
  }

  const imageKey:
    | "logo_url"
    | "photo_url"
    | "image_url" =
    type ===
      "clients" ||
    type ===
      "technologies"
      ? "logo_url"
      : type ===
          "team"
        ? "photo_url"
        : "image_url";

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

        {/* ================= CLIENT ================= */}

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

        {/* ================= TEAM ================= */}

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

        {/* ================= TECHNOLOGIES ================= */}

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

        {/* ================= PRODUCTS ================= */}

        {type ===
          "products" && (
          <>
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
          </>
        )}

        {/* ================= IMAGE ================= */}

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
                  form[
                    imageKey
                  ]
                }
                alt={
                  form.name ??
                  ""
                }
              />
            </div>
          )}

          {/* URL MANUAL */}

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

          {/* FILE */}

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