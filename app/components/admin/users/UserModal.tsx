"use client";

import type {
  UserForm,
  UserItem,
} from "../types";

import styles from "@/app/styles/admin/AdminUI.module.css";

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
    UserItem |
    null;

  form:
    UserForm;

  onClose:
    () => void;

  onChange:
    <
      K extends keyof UserForm
    >(
      key: K,
      value:
        UserForm[K]
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
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className={
          styles.modal
        }
      >

        {/* HEADER */}

        <div
          className={
            styles.modalHeader
          }
        >
          <h2>
            {editingUser
              ? "Edit Administrator"
              : "Tambah Administrator"}
          </h2>

          <button
            type="button"
            className={
              styles.modalClose
            }
            onClick={
              onClose
            }
            aria-label="Tutup"
            title="Tutup"
          >
            ×
          </button>
        </div>

        {/* BODY */}

        <div
          className={`${styles.modalBody} ${styles.hideScrollbar}`}
        >
          <div
            className={
              styles.formGrid
            }
            style={{
              padding:
                0,
            }}
          >

            {/* NAME */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Nama
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.name
                }
                placeholder="Nama administrator"
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
              <label>
                Email
              </label>

              <input
                className={
                  styles.input
                }
                type="email"
                value={
                  form.email
                }
                placeholder="admin@email.com"
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
              <label>
                Password
                {editingUser &&
                  " (kosongkan jika tidak diubah)"}
              </label>

              <input
                className={
                  styles.input
                }
                type="password"
                value={
                  form.password
                }
                placeholder={
                  editingUser
                    ? "Password baru (opsional)"
                    : "Password"
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
            </div>

            {/* STATUS */}

            <div
              className={`${styles.field} ${styles.full}`}
            >
              <label>
                Status
              </label>

              <select
                className={
                  styles.select
                }
                value={
                  form.active_status
                    ? "active"
                    : "inactive"
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

        {/* FOOTER */}

        <div
          className={
            styles.modalFooter
          }
        >
          <button
            type="button"
            className={
              styles.secondaryButton
            }
            onClick={
              onClose
            }
            disabled={
              saving
            }
          >
            Batal
          </button>

          <button
            type="button"
            className={
              styles.primaryButton
            }
            onClick={
              onSave
            }
            disabled={
              saving
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