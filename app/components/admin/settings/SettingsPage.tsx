"use client";

import ErrorBox from "../shared/ErrorBox";
import LoadingState from "../shared/LoadingState";
import SectionHeader from "../shared/SectionHeader";
import SuccessBox from "../shared/SuccessBox";
import styles from "@/app/styles/admin/AdminUI.module.css";
import { useSettingsForm } from "@/app/hooks/admin/useSettingsForm";

export default function SettingsPage() {
  const { form, update, error, message, loading, saving, save } = useSettingsForm(
    "website",
    {
      company_name: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      logo_url: "",
      favicon_url: "",
      copyright: "",
    }
  );

  return (
    <>
      <SectionHeader title="Setting" desc="Kelola identitas dan informasi utama website." />
      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <section className={styles.editorCard}>
        <div className={styles.editorHeader}>
          <div>
            <h2>Informasi Website</h2>
            <p>Data identitas utama Permana Solutions.</p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Nama Perusahaan</label>
              <input className={styles.input} value={form.company_name ?? ""} onChange={(e) => update("company_name", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input className={styles.input} type="email" value={form.email ?? ""} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Nomor Telepon</label>
              <input className={styles.input} value={form.phone ?? ""} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>WhatsApp</label>
              <input className={styles.input} value={form.whatsapp ?? ""} onChange={(e) => update("whatsapp", e.target.value)} />
            </div>
            <div className={`${styles.field} ${styles.full}`}>
              <label>Alamat</label>
              <textarea className={styles.textarea} value={form.address ?? ""} onChange={(e) => update("address", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>URL Logo</label>
              <input className={styles.input} value={form.logo_url ?? ""} onChange={(e) => update("logo_url", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>URL Favicon</label>
              <input className={styles.input} value={form.favicon_url ?? ""} onChange={(e) => update("favicon_url", e.target.value)} />
            </div>
            <div className={`${styles.field} ${styles.full}`}>
              <label>Copyright Footer</label>
              <input className={styles.input} value={form.copyright ?? ""} onChange={(e) => update("copyright", e.target.value)} />
            </div>
          </div>
        )}

        <div className={styles.editorFooter}>
          <button type="button" className={styles.primaryButton} disabled={saving || loading} onClick={() => save("Pengaturan website berhasil disimpan.")}>
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </section>
    </>
  );
}
