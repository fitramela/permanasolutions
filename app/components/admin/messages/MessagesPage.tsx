"use client";

import { useMessages } from "@/app/hooks/admin/useMessages";
import { formatDate } from "../utils";
import EmptyState from "../shared/EmptyState";
import ErrorBox from "../shared/ErrorBox";
import LoadingState from "../shared/LoadingState";
import SectionHeader from "../shared/SectionHeader";
import styles from "@/app/styles/admin/AdminUI.module.css";

export default function MessagesPage() {
  const { messages, loading, error } = useMessages();

  return (
    <>
      <SectionHeader
        title="Messages"
        desc="Pesan yang dikirim pengunjung melalui website."
      />

      <ErrorBox message={error} />

      <section className={styles.editorCard}>
        <div className={styles.editorHeader}>
          <div>
            <h2>Pesan Masuk</h2>
            <p>Daftar pesan dan calon pelanggan dari landing page.</p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : messages.length === 0 ? (
          <EmptyState>Belum ada pesan masuk.</EmptyState>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pengirim</th>
                  <th>Kontak</th>
                  <th>Pesan</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((item, index) => (
                  <tr key={item.id ?? `${item.email}-${index}`}>
                    <td>
                      <div className={styles.tablePrimary}>
                        {item.full_name ?? item.name ?? "-"}
                      </div>
                      {item.company && (
                        <div className={styles.tableSecondary}>{item.company}</div>
                      )}
                    </td>
                    <td>
                      <div>{item.email ?? "-"}</div>
                      <div className={styles.tableSecondary}>{item.phone ?? "-"}</div>
                    </td>
                    <td>
                      <div className={styles.messagePreview}>{item.message ?? "-"}</div>
                    </td>
                    <td>
                      <span className={styles.statusBadge}>{item.status ?? "new"}</span>
                    </td>
                    <td>{formatDate(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
