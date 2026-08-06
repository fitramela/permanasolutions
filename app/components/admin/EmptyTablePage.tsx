"use client";
import styles from "./AdminUI.module.css";

export default function EmptyTablePage({ title, description, columns }: { title:string; description:string; columns:string[] }) {
  return (
    <>
      <div className={styles.pageHeader}>
        <div><h1>{title}</h1><p>{description}</p></div>
        <button type="button" className={styles.primaryButton}>＋ Tambah Data</button>
      </div>
      <section className={styles.card}>
        <div className={styles.tableToolbar}>
          <input className={styles.search} placeholder={`Cari ${title.toLowerCase()}...`} />
          <button type="button" className={styles.secondaryButton}>Filter Status ▾</button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>No</th>{columns.map(column => <th key={column}>{column}</th>)}<th>Status</th><th>Aksi</th></tr></thead>
            <tbody><tr className={styles.emptyRow}><td colSpan={columns.length + 3}>Belum ada data.</td></tr></tbody>
          </table>
        </div>
      </section>
    </>
  );
}
