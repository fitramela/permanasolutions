"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  LoaderCircle,
  Save,
  X,
} from "lucide-react";

import MasterForm from "./MasterForm";

import type {
  MasterItem,
  MasterType,
} from "./types";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";
import modalStyles from "@/app/styles/admin/AdminModal.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
  ...modalStyles,
};

type Props = {
  open: boolean;

  type: MasterType;

  title: string;

  indonesia:
    MasterItem;

  english:
    MasterItem;

  saving?: boolean;

  serviceFilter?: string;

  onClose:
    () => void;

  onSave: (
    indonesia:
      MasterItem,
    english:
      MasterItem
  ) => Promise<void>;
};

export default function EditMasterModal({
  open,
  type,
  title,
  indonesia,
  english,
  saving = false,
  serviceFilter,
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

  /* =========================================================
     SYNC
  ========================================================= */

  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    setIdForm({
      ...indonesia,

      ...(type ===
        "products" &&
      serviceFilter
        ? {
            service:
              serviceFilter,
          }
        : {}),

      locale:
        "id",
    });

    setEnForm({
      ...english,

      ...(type ===
        "products" &&
      serviceFilter
        ? {
            service:
              serviceFilter,
          }
        : {}),

      locale:
        "en",
    });
  }, [
    open,
    indonesia,
    english,
    type,
    serviceFilter,
  ]);

  /* =========================================================
     BODY LOCK
  ========================================================= */

  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    const oldOverflow =
      document.body
        .style
        .overflow;

    document.body
      .style
      .overflow =
      "hidden";

    return () => {
      document.body
        .style
        .overflow =
        oldOverflow;
    };
  }, [
    open,
  ]);

  /* =========================================================
     ESC
  ========================================================= */

  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    function handleKeyDown(
      event:
        KeyboardEvent
    ) {
      if (
        event.key ===
          "Escape" &&
        !saving
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
    saving,
    onClose,
  ]);

  if (
    !open
  ) {
    return null;
  }

  return (
    <div
      className={
        styles.modalOverlay
      }
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
            event.currentTarget &&
          !saving
        ) {
          onClose();
        }
      }}
    >
      <div
        className={
          styles.masterModal
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="master-modal-title"
      >
        {/* HEADER */}

        <div
          className={
            styles.masterModalHeader
          }
        >
          <h2
            id="master-modal-title"
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
            <X
              size={19}
            />
          </button>
        </div>

        {/* BODY */}

        <div
          className={`${styles.masterModalBody} ${styles.hideScrollbar}`}
        >
          <div
            className={
              styles.bilingualGrid
            }
          >
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
                serviceFilter={
                  serviceFilter
                }
              />
            </div>

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
                serviceFilter={
                  serviceFilter
                }
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}

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
              styles.secondaryIconButton
            }
            aria-label="Batal"
            title="Batal"
          >
            <X
              size={18}
            />
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

                  ...(type ===
                    "products" &&
                  serviceFilter
                    ? {
                        service:
                          serviceFilter,
                      }
                    : {}),

                  locale:
                    "id",
                },

                {
                  ...enForm,

                  ...(type ===
                    "products" &&
                  serviceFilter
                    ? {
                        service:
                          serviceFilter,
                      }
                    : {}),

                  locale:
                    "en",
                }
              )
            }
            className={
              styles.primaryIconButton
            }
            aria-label="Simpan"
            title="Simpan"
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
      </div>
    </div>
  );
}