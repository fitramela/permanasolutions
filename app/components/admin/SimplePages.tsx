import styles from "./AdminUI.module.css";

export function Messages() {
  return <><div className={styles.pageHeader}><div><h1>Pesan Masuk</h1><p>Pesan dari formulir website akan tampil di sini.</p></div></div><div className={styles.emptyState}>Belum ada pesan masuk.</div></>;
}

export function Media() {
  return <><div className={styles.pageHeader}><div><h1>Media Library</h1><p>Kelola gambar dan dokumen website.</p></div><button className={styles.primaryButton}>＋ Upload File</button></div><div className={styles.mediaGrid}><div className={styles.emptyState}>Belum ada file media.</div></div></>;
}

export function Settings() {
  return (
    <>
      <div className={styles.pageHeader}><div><h1>Pengaturan Website</h1><p>Atur identitas, informasi perusahaan, media sosial, bahasa, dan SEO.</p></div></div>
      <div className={styles.settingsGrid}>
        <aside className={styles.settingMenu}>{["Identitas Website","Informasi Perusahaan","Media Sosial","SEO","Bahasa"].map(item=><button key={item}>{item}</button>)}</aside>
        <section className={styles.editorCard}>
          <div className={styles.editorHeader}><div><h2>Identitas Website</h2><p>Isi data branding utama website.</p></div></div>
          <div className={styles.formGrid}>
            <div className={styles.field}><label>Nama website</label><input className={styles.input} placeholder="Masukkan nama website" /></div>
            <div className={styles.field}><label>Nama legal</label><input className={styles.input} placeholder="Masukkan nama legal perusahaan" /></div>
            <div className={`${styles.field} ${styles.full}`}><label>Deskripsi website</label><textarea className={styles.textarea} placeholder="Masukkan deskripsi website" /></div>
            <div className={`${styles.field} ${styles.full}`}><label>Logo utama</label><label className={styles.upload}><input type="file" accept="image/*" hidden /><strong>＋ Pilih logo</strong></label></div>
          </div>
          <div className={styles.editorFooter}><button className={styles.primaryButton}>Simpan Pengaturan</button></div>
        </section>
      </div>
    </>
  );
}
