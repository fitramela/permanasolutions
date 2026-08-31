"use client";

import ErrorBox from "../shared/ErrorBox";
import LoadingState from "../shared/LoadingState";
import SectionHeader from "../shared/SectionHeader";
import SuccessBox from "../shared/SuccessBox";
import styles from "@/app/styles/admin/AdminUI.module.css";
import { useSettingsForm } from "@/app/hooks/admin/useSettingsForm";

const fields = ["instagram", "facebook", "linkedin", "youtube", "tiktok"];

export default function SocialMediaPage() {
  const { form, update, error, message, loading, saving, save } = useSettingsForm(
    "social_media",
    { instagram: "", facebook: "", linkedin: "", youtube: "", tiktok: "" }
  );

  return (
    <>
      <SectionHeader title="Social Media" desc="Kelola seluruh akun social media Permana Solutions." />
      <ErrorBox message={error} />
      <SuccessBox message={message} />

      <section className={styles.editorCard}>
        <div className={styles.editorHeader}>
          <div>
            <h2>Akun Social Media</h2>
            <p>Link ini dapat digunakan pada navbar, footer, dan halaman contact.</p>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div className={styles.formGrid}>
            {fields.map((field) => (
              <div key={field} className={styles.field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  className={styles.input}
                  value={form[field] ?? ""}
                  placeholder={`https://${field}.com/...`}
                  onChange={(e) => update(field, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        <div className={styles.editorFooter}>
          <button type="button" className={styles.primaryButton} disabled={saving || loading} onClick={() => save("Social media berhasil disimpan.")}>
            {saving ? "Menyimpan..." : "Simpan Social Media"}
          </button>
        </div>
      </section>
    </>
  );
}
