"use client";

import {
  useMemo,
} from "react";

import { adminFetch } from "../api";

import styles from "@/app/styles/admin/AdminUI.module.css";

import ImageField from "./ImageField";

import {
  flatten,
  isImagePath,
  prettyLabel,
  setAtPath,
} from "./helpers";

import type {
  JsonObject,
  Locale,
  PageSection,
} from "./types";

type Props = {
  pageSlug: string;

  active: string;

  locale: Locale;

  sectionContent:
    JsonObject;

  setSectionContent:
    React.Dispatch<
      React.SetStateAction<JsonObject>
    >;

  sectionEnabled:
    boolean;

  setSectionEnabled:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;

  sectionTabs:
    string[];

  websiteHref:
    string;

  saving:
    boolean;

  setSaving:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;

  error:
    string;

  setError:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  message:
    string;

  setMessage:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  onSaved: (
    section: PageSection
  ) => void;
};

export default function SectionEditor({
  pageSlug,
  active,
  locale,
  sectionContent,
  setSectionContent,
  sectionEnabled,
  setSectionEnabled,
  sectionTabs,
  websiteHref,
  saving,
  setSaving,
  error,
  setError,
  message,
  setMessage,
  onSaved,
}: Props) {
  const leaves =
    useMemo(
      () =>
        flatten(
          sectionContent
        ),
      [
        sectionContent,
      ]
    );

  async function saveSection() {
    if (!active) {
      return;
    }

    try {
      setSaving(
        true
      );

      setError("");
      setMessage("");

      const response =
        await adminFetch<{
          success:
            boolean;

          data:
            PageSection;
        }>(
          `/cms/pages/${pageSlug}/sections/${encodeURIComponent(
            active
          )}`,
          {
            method:
              "PUT",

            body:
              JSON.stringify({
                locale,

                title:
                  active,

                content:
                  sectionContent,

                is_active:
                  sectionEnabled,

                sort_order:
                  Math.max(
                    0,
                    sectionTabs.indexOf(
                      active
                    )
                  ),
              }),
          }
        );

      onSaved(
        response.data
      );

      setMessage(
        "Perubahan berhasil disimpan ke CMS."
      );
    } catch (error) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Gagal menyimpan perubahan."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  return (
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
            {active}
          </h2>

          <p>
            Ubah teks,
            gambar, link,
            dan konten yang
            tampil pada
            section ini.
          </p>
        </div>

        <label
          className={
            styles.inlineToggle
          }
        >
          <input
            type="checkbox"
            checked={
              sectionEnabled
            }
            onChange={(
              event
            ) =>
              setSectionEnabled(
                event.target
                  .checked
              )
            }
          />

          Aktif
        </label>

      </div>

      {error && (
        <div
          className={
            styles.errorBox
          }
        >
          {error}
        </div>
      )}

      {message && (
        <div
          className={
            styles.successBox
          }
        >
          {message}
        </div>
      )}

      {leaves.length ===
      0 ? (
        <div
          className={
            styles.emptyState
          }
        >
          Section ini belum
          memiliki field
          konten.
        </div>
      ) : (
        <div
          className={
            styles.formGrid
          }
        >

          {leaves.map(
            (leaf) => {
              const key =
                leaf.path.join(
                  "."
                );

              const longText =
                typeof leaf.value ===
                  "string" &&
                (
                  leaf.value
                    .length >
                    90 ||
                  leaf.value.includes(
                    "\n"
                  )
                );

              if (
                isImagePath(
                  leaf.path
                )
              ) {
                return (
                  <ImageField
                    key={
                      key
                    }
                    label={
                      prettyLabel(
                        leaf.path
                      )
                    }
                    value={
                      String(
                        leaf.value ??
                          ""
                      )
                    }
                    onChange={(
                      url
                    ) =>
                      setSectionContent(
                        (
                          current
                        ) =>
                          setAtPath(
                            current,
                            leaf.path,
                            url
                          )
                      )
                    }
                  />
                );
              }

              return (
                <div
                  key={key}
                  className={`${styles.field} ${
                    longText
                      ? styles.full
                      : ""
                  }`}
                >

                  <label>
                    {prettyLabel(
                      leaf.path
                    )}
                  </label>

                  {typeof leaf.value ===
                  "boolean" ? (
                    <select
                      className={
                        styles.select
                      }
                      value={
                        String(
                          leaf.value
                        )
                      }
                      onChange={(
                        event
                      ) =>
                        setSectionContent(
                          (
                            current
                          ) =>
                            setAtPath(
                              current,
                              leaf.path,
                              event
                                .target
                                .value ===
                                "true"
                            )
                        )
                      }
                    >
                      <option value="true">
                        Aktif
                      </option>

                      <option value="false">
                        Nonaktif
                      </option>
                    </select>
                  ) : longText ? (
                    <textarea
                      className={
                        styles.textarea
                      }
                      value={
                        String(
                          leaf.value
                        )
                      }
                      onChange={(
                        event
                      ) =>
                        setSectionContent(
                          (
                            current
                          ) =>
                            setAtPath(
                              current,
                              leaf.path,
                              event
                                .target
                                .value
                            )
                        )
                      }
                    />
                  ) : (
                    <input
                      className={
                        styles.input
                      }
                      value={
                        String(
                          leaf.value
                        )
                      }
                      type={
                        typeof leaf.value ===
                        "number"
                          ? "number"
                          : "text"
                      }
                      onChange={(
                        event
                      ) =>
                        setSectionContent(
                          (
                            current
                          ) =>
                            setAtPath(
                              current,
                              leaf.path,
                              typeof leaf.value ===
                                "number"
                                ? Number(
                                    event
                                      .target
                                      .value
                                  )
                                : event
                                    .target
                                    .value
                            )
                        )
                      }
                    />
                  )}

                </div>
              );
            }
          )}

        </div>
      )}

      <div
        className={
          styles.editorFooter
        }
      >

        <a
          className={
            styles.secondaryButton
          }
          href={
            websiteHref
          }
          target="_blank"
          rel="noreferrer"
        >
          Preview
        </a>

        <button
          type="button"
          className={
            styles.primaryButton
          }
          onClick={
            saveSection
          }
          disabled={
            saving
          }
        >
          {saving
            ? "Menyimpan..."
            : "Simpan Perubahan"}
        </button>

      </div>

    </section>
  );
}