"use client";

import {
  LoaderCircle,
  Save,
  X,
} from "lucide-react";

import type {
  UserForm,
  UserItem,
} from "../types";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";
import modalStyles from "@/app/styles/admin/AdminModal.module.css";

const styles = {
  ...baseStyles,
  ...formStyles,
  ...modalStyles,
};

export default function UserModal({
  open,
  saving,
  editingUser,
  form,
  onClose,
  onChange,
  onSave,
}: {
  open: boolean;

  saving: boolean;

  editingUser:
    | UserItem
    | null;

  form: UserForm;

  onClose:
    () => void;

  onChange: <
    K extends keyof UserForm
  >(
    key: K,
    value: UserForm[K]
  ) => void;

  onSave:
    () => void;
}) {
  if (!open) {
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
      role="presentation"
    >
      <div
        className={
          styles.modal
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
      >
        {/* ================= HEADER ================= */}

        <div
          className={
            styles.modalHeader
          }
        >
          <div>
            <h2
              id="user-modal-title"
            >
              {editingUser
                ? "Edit Administrator"
                : "Tambah Administrator"}
            </h2>

            <p>
              {editingUser
                ? "Perbarui informasi akun administrator."
                : "Tambahkan administrator baru ke dashboard."}
            </p>
          </div>

          <button
            type="button"
            className={
              styles.modalClose
            }
            onClick={
              onClose
            }
            disabled={
              saving
            }
            aria-label="Tutup modal"
            title="Tutup"
          >
            <X
              size={19}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* ================= BODY ================= */}

        <div
          className={`${styles.modalBody} ${styles.hideScrollbar}`}
        >
          <div
            className={
              styles.formGrid
            }
          >
            {/* NAME */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="admin-name"
              >
                Nama
              </label>

              <input
                id="admin-name"
                className={
                  styles.input
                }
                value={
                  form.name
                }
                placeholder="Nama administrator"
                autoComplete="name"
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  onChange(
                    "name",
                    event.target
                      .value
                  )
                }
              />
            </div>

            {/* EMAIL */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="admin-email"
              >
                Email
              </label>

              <input
                id="admin-email"
                className={
                  styles.input
                }
                type="email"
                value={
                  form.email
                }
                placeholder="admin@email.com"
                autoComplete="email"
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  onChange(
                    "email",
                    event.target
                      .value
                  )
                }
              />
            </div>

            {/* PASSWORD */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="admin-password"
              >
                Password

                {editingUser && (
                  <span
                    className={
                      styles.optionalLabel
                    }
                  >
                    {" "}
                    — opsional
                  </span>
                )}
              </label>

              <input
                id="admin-password"
                className={
                  styles.input
                }
                type="password"
                value={
                  form.password
                }
                placeholder={
                  editingUser
                    ? "Kosongkan jika tidak diubah"
                    : "Masukkan password"
                }
                autoComplete="new-password"
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  onChange(
                    "password",
                    event.target
                      .value
                  )
                }
              />

              {editingUser && (
                <small
                  className={
                    styles.help
                  }
                >
                  Biarkan kosong jika password tidak ingin diubah.
                </small>
              )}
            </div>

            {/* STATUS */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label
                htmlFor="admin-status"
              >
                Status
              </label>

              <select
                id="admin-status"
                className={
                  styles.select
                }
                value={
                  form.active_status
                    ? "active"
                    : "inactive"
                }
                disabled={
                  saving
                }
                onChange={(
                  event
                ) =>
                  onChange(
                    "active_status",
                    event.target
                      .value ===
                      "active"
                  )
                }
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <div
          className={
            styles.modalFooter
          }
        >
          <button
            type="button"
            className={
              styles.secondaryIconButton
            }
            onClick={
              onClose
            }
            disabled={
              saving
            }
            aria-label="Batal"
            title="Batal"
          >
            <X
              size={18}
              strokeWidth={2}
            />
          </button>

          <button
            type="button"
            className={
              styles.primaryIconButton
            }
            onClick={
              onSave
            }
            disabled={
              saving
            }
            aria-label={
              saving
                ? "Sedang menyimpan"
                : "Simpan administrator"
            }
            title={
              saving
                ? "Menyimpan..."
                : "Simpan"
            }
          >
            {saving ? (
              <LoaderCircle
                size={18}
                strokeWidth={2}
                className={
                  styles.spin
                }
              />
            ) : (
              <Save
                size={18}
                strokeWidth={2}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}