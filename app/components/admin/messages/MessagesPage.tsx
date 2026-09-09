"use client";

import {
  useMessages,
} from "@/app/hooks/admin/useMessages";

import {
  formatDate,
} from "../utils";

import EmptyState from "../shared/EmptyState";
import ErrorBox from "../shared/ErrorBox";
import LoadingState from "../shared/LoadingState";
import SectionHeader from "../shared/SectionHeader";

import baseStyles from "@/app/styles/admin/AdminBase.module.css";
import tableStyles from "@/app/styles/admin/AdminTable.module.css";

const styles = {
  ...baseStyles,
  ...tableStyles,
};

export default function MessagesPage() {
  const {
    messages,
    loading,
    error,
  } =
    useMessages();

  return (
    <>
      {/* ================= HEADER ================= */}

      <SectionHeader
        title="Messages"
        desc="Pesan yang dikirim pengunjung melalui website."
      />

      {/* ================= STATUS ================= */}

      <ErrorBox
        message={
          error
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
              Pesan Masuk
            </h2>

            <p>
              Daftar pesan
              dan calon pelanggan
              dari landing page.
            </p>
          </div>

          <span
            className={
              styles.tableCount
            }
          >
            {messages.length}
            {" "}
            pesan
          </span>
        </div>

        {/* ================= DATA ================= */}

        {loading ? (
          <LoadingState />
        ) : messages.length ===
          0 ? (
          <EmptyState>
            Belum ada pesan masuk.
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
                    Pengirim
                  </th>

                  <th>
                    Kontak
                  </th>

                  <th>
                    Pesan
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Tanggal
                  </th>
                </tr>
              </thead>

              <tbody>
                {messages.map(
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
                      {/* PENGIRIM */}

                      <td>
                        <div
                          className={
                            styles.tablePrimary
                          }
                        >
                          {item.full_name ??
                            item.name ??
                            "-"}
                        </div>

                        {item.company && (
                          <div
                            className={
                              styles.tableSecondary
                            }
                          >
                            {
                              item.company
                            }
                          </div>
                        )}
                      </td>

                      {/* KONTAK */}

                      <td>
                        <div
                          className={
                            styles.tablePrimary
                          }
                        >
                          {item.email ??
                            "-"}
                        </div>

                        <div
                          className={
                            styles.tableSecondary
                          }
                        >
                          {item.phone ??
                            "-"}
                        </div>
                      </td>

                      {/* PESAN */}

                      <td>
                        <div
                          className={
                            styles.messagePreview
                          }
                          title={
                            item.message ??
                            ""
                          }
                        >
                          {item.message ??
                            "-"}
                        </div>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={
                            styles.statusBadge
                          }
                        >
                          {item.status ??
                            "new"}
                        </span>
                      </td>

                      {/* DATE */}

                      <td>
                        <span
                          className={
                            styles.tableSecondary
                          }
                        >
                          {formatDate(
                            item.created_at
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}