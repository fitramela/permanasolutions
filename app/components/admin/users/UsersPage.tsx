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

import styles from "@/app/styles/admin/AdminUI.module.css";

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
              size={21}
              strokeWidth={
                2.3
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
              Kelola akun administrator dan keamanan 2FA.
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : items.length ===
          0 ? (
          <EmptyState>
            Belum ada user administrator.
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

                  <th>
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

                      {/* NAME */}

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

                      {/* EMAIL */}

                      <td>
                        {item.email ??
                          "-"}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={
                            styles.statusBadge
                          }
                        >
                          {item.active_status
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      {/* 2FA */}

                      <td>
                        <span
                          className={
                            styles.statusBadge
                          }
                        >
                          {item.two_fa_enabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </td>

                      {/* LOGIN */}

                      <td>
                        {formatDate(
                          item.last_login_at
                        )}
                      </td>

                      {/* ACTIONS */}

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
                            aria-label="Edit administrator"
                            title="Edit"
                          >
                            <Pencil
                              size={16}
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
                            aria-label="Reset 2FA"
                            title="Reset 2FA"
                          >
                            <RotateCcw
                              size={16}
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
                            aria-label="Hapus administrator"
                            title="Hapus"
                          >
                            <Trash2
                              size={16}
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