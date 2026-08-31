"use client";

import {
  useEffect,
  useState,
} from "react";

import MasterForm from "./MasterForm";

import styles from "@/app/styles/admin/AdminUI.module.css";

import type {
  MasterItem,
  MasterType,
} from "./types";

type Props = {
  open: boolean;

  type: MasterType;

  title: string;

  indonesia: MasterItem;

  english: MasterItem;

  saving?: boolean;

  onClose: () => void;

  onSave: (
    indonesia: MasterItem,
    english: MasterItem
  ) => Promise<void>;
};

export default function EditMasterModal({
  open,
  type,
  title,
  indonesia,
  english,
  saving = false,
  onClose,
  onSave,
}: Props) {
  const [
    idForm,
    setIdForm,
  ] =
    useState<MasterItem>(
      indonesia
    );

  const [
    enForm,
    setEnForm,
  ] =
    useState<MasterItem>(
      english
    );

  /**
   * Update form setiap modal dibuka.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    setIdForm({
      ...indonesia,
      locale: "id",
    });

    setEnForm({
      ...english,
      locale: "en",
    });
  }, [
    open,
    indonesia,
    english,
  ]);

  /**
   * Lock scroll halaman belakang.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const oldOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        oldOverflow;
    };
  }, [open]);

  /**
   * ESC untuk tutup modal.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.modalOverlay}
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className={
          styles.masterModal
        }
      >

        {/* ================= HEADER ================= */}

        <div
          className={
            styles.masterModalHeader
          }
        >
          <h2
            className={
              styles.masterModalTitle
            }
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              saving
            }
            className={
              styles.modalCloseButton
            }
            aria-label="Tutup"
            title="Tutup"
          >
            ×
          </button>
        </div>

        {/* ================= CONTENT ================= */}

        <div
          className={`${styles.masterModalBody} ${styles.hideScrollbar}`}
        >
          <div
            className={
              styles.bilingualGrid
            }
          >

            {/* INDONESIA */}

            <div
              className={
                styles.languagePanel
              }
            >
              <MasterForm
                type={
                  type
                }
                form={
                  idForm
                }
                setForm={
                  setIdForm
                }
                localeLabel="Indonesia"
              />
            </div>

            {/* ENGLISH */}

            <div
              className={
                styles.languagePanel
              }
            >
              <MasterForm
                type={
                  type
                }
                form={
                  enForm
                }
                setForm={
                  setEnForm
                }
                localeLabel="English"
              />
            </div>

          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <div
          className={
            styles.masterModalFooter
          }
        >
          <button
            type="button"
            disabled={
              saving
            }
            onClick={
              onClose
            }
            className={
              styles.modalCancelButton
            }
          >
            Batal
          </button>

          <button
            type="button"
            disabled={
              saving
            }
            onClick={() =>
              onSave(
                {
                  ...idForm,
                  locale:
                    "id",
                },
                {
                  ...enForm,
                  locale:
                    "en",
                }
              )
            }
            className={
              styles.modalSaveButton
            }
          >
            {saving
              ? "Menyimpan..."
              : "Simpan"}
          </button>
        </div>

      </div>
    </div>
  );
}