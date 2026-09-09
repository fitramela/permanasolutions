"use client";

import {
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";

import {
  useUsers,
} from "@/app/hooks/admin/useUsers";

import {
  formatDate,
} from "../utils";

import EmptyState from "../shared/EmptyState";
import ErrorBox from "../shared/ErrorBox";
import LoadingState from "../shared/LoadingState";
import SectionHeader from "../shared/SectionHeader";
import SuccessBox from "../shared/SuccessBox";
import UserModal from "./UserModal";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import formStyles from "@/app/styles/admin/AdminForm.module.css";
import tableStyles from "@/app/styles/admin/AdminTable.module.css";

/* =========================================================
   MERGE ADMIN STYLES
========================================================= */

const styles = {
  ...baseStyles,
  ...formStyles,
  ...tableStyles,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function UsersPage() {
  const {
    items,
    loading,
    saving,
    error,
    message,

    modalOpen,
    editingUser,
    form,

    openCreate,
    openEdit,
    closeModal,
    updateForm,

    saveUser,
    deleteUser,
    reset2FA,
  } =
    useUsers();

  return (
    <>
      {/* ================= HEADER ================= */}

      <SectionHeader
        title="Users"
        desc="Kelola akun administrator yang memiliki akses ke dashboard."
        action={
          <button
            type="button"
            className={
              styles.addIconButton
            }
            onClick={
              openCreate
            }
            aria-label="Tambah administrator"
            title="Tambah administrator"
          >
            <Plus
              size={20}
              strokeWidth={
                2.2
              }
            />
          </button>
        }
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
        {/* ================= CARD HEADER ================= */}

        <div
          className={
            styles.editorHeader
          }
        >
          <div>
            <h2>
              Admin Users
            </h2>

            <p>
              Kelola akun
              administrator
              dan keamanan
              2FA.
            </p>
          </div>

          <span
            className={
              styles.tableCount
            }
          >
            {items.length}
            {" "}
            user
          </span>
        </div>

        {/* ================= CONTENT ================= */}

        {loading ? (
          <LoadingState />
        ) : items.length ===
          0 ? (
          <EmptyState>
            Belum ada user
            administrator.
          </EmptyState>
        ) : (
          <div
            className={`${styles.tableWrap} ${styles.hideScrollbar}`}
          >
            <table
              className={
                styles.table
              }
            >
              <thead>
                <tr>
                  <th>
                    Nama
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    2FA
                  </th>

                  <th>
                    Login Terakhir
                  </th>

                  <th
                    className={
                      styles.actionColumn
                    }
                  >
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={
                        item.id ??
                        `${item.email}-${index}`
                      }
                    >
                      {/* ================= NAME ================= */}

                      <td>
                        <div
                          className={
                            styles.tablePrimary
                          }
                        >
                          {item.name ??
                            "-"}
                        </div>
                      </td>

                      {/* ================= EMAIL ================= */}

                      <td>
                        <span
                          className={
                            styles.tableSecondary
                          }
                        >
                          {item.email ??
                            "-"}
                        </span>
                      </td>

                      {/* ================= STATUS ================= */}

                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            item.active_status
                              ? styles.statusActive
                              : styles.statusInactive
                          }`}
                        >
                          {item.active_status
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* ================= 2FA ================= */}

                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            item.two_fa_enabled
                              ? styles.statusEnabled
                              : styles.statusDisabled
                          }`}
                        >
                          {item.two_fa_enabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </td>

                      {/* ================= LOGIN ================= */}

                      <td>
                        <span
                          className={
                            styles.tableSecondary
                          }
                        >
                          {formatDate(
                            item.last_login_at
                          )}
                        </span>
                      </td>

                      {/* ================= ACTIONS ================= */}

                      <td>
                        <div
                          className={
                            styles.tableActions
                          }
                        >
                          {/* EDIT */}

                          <button
                            type="button"
                            className={
                              styles.iconEditButton
                            }
                            onClick={() =>
                              openEdit(
                                item
                              )
                            }
                            aria-label={`Edit ${item.name ?? "administrator"}`}
                            title="Edit"
                          >
                            <Pencil
                              size={17}
                              strokeWidth={
                                2
                              }
                            />
                          </button>

                          {/* RESET 2FA */}

                          <button
                            type="button"
                            className={
                              styles.iconResetButton
                            }
                            onClick={() =>
                              reset2FA(
                                item
                              )
                            }
                            aria-label={`Reset 2FA ${item.name ?? "administrator"}`}
                            title="Reset 2FA"
                          >
                            <RotateCcw
                              size={17}
                              strokeWidth={
                                2
                              }
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className={
                              styles.iconDeleteButton
                            }
                            onClick={() =>
                              deleteUser(
                                item
                              )
                            }
                            aria-label={`Hapus ${item.name ?? "administrator"}`}
                            title="Hapus"
                          >
                            <Trash2
                              size={17}
                              strokeWidth={
                                2
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= MODAL ================= */}

      <UserModal
        open={
          modalOpen
        }
        saving={
          saving
        }
        editingUser={
          editingUser
        }
        form={
          form
        }
        onClose={
          closeModal
        }
        onChange={
          updateForm
        }
        onSave={
          saveUser
        }
      />
    </>
  );
}