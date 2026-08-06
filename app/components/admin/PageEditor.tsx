"use client";

import { useMemo, useState } from "react";
import type { FieldDefinition, PageDefinition } from "./admin-pages";
import styles from "./AdminUI.module.css";

function Field({ field }: { field: FieldDefinition }) {
  if (field.type === "image") {
    return (
      <div className={`${styles.field} ${styles.full}`}>
        <label>{field.label}</label>
        <label className={styles.upload}>
          <input type="file" accept="image/*" hidden />
          <span><strong>＋ Pilih gambar</strong><br />Klik untuk memilih file</span>
        </label>
        {field.help && <span className={styles.help}>{field.help}</span>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return <div className={`${styles.field} ${styles.full}`}><label>{field.label}</label><textarea className={styles.textarea} placeholder={field.placeholder} /></div>;
  }

  if (field.type === "select") {
    return <div className={styles.field}><label>{field.label}</label><select className={styles.select} defaultValue=""><option value="" disabled>Pilih opsi</option>{field.options?.map(option=><option key={option}>{option}</option>)}</select></div>;
  }

  return <div className={styles.field}><label>{field.label}</label><input className={styles.input} type={field.type} placeholder={field.placeholder} /></div>;
}

export default function PageEditor({ definition }: { definition: PageDefinition }) {
  const [activeSection, setActiveSection] = useState(definition.sections[0]?.id ?? "");
  const selected = useMemo(
    () => definition.sections.find(section => section.id === activeSection) ?? definition.sections[0],
    [activeSection, definition.sections]
  );

  if (!selected) return null;

  return (
    <>
      <div className={styles.breadcrumb}>
        {definition.breadcrumb.map((item,index)=><span key={item}>{index > 0 && "› "}{index === definition.breadcrumb.length - 1 ? <strong>{item}</strong> : item}</span>)}
      </div>
      <div className={styles.pageHeader}>
        <div><h1>{definition.title}</h1><p>{definition.description}</p></div>
        <button type="button" className={styles.websiteButton}>Lihat Website ↗</button>
      </div>

      <div className={styles.editorLayout}>
        <aside className={styles.sectionNav}>
          {definition.sections.map(section => (
            <button key={section.id} type="button" onClick={() => setActiveSection(section.id)} className={activeSection === section.id ? styles.activeSection : ""}>
              <span>{section.title}</span><span>›</span>
            </button>
          ))}
        </aside>

        <section className={styles.editorCard}>
          <div className={styles.editorHeader}>
            <div><h2>{selected.title}</h2><p>{selected.subtitle}</p></div>
            <button type="button" className={styles.switch} aria-label="Aktifkan section" />
          </div>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${styles.tabActive}`} type="button">Konten</button>
            <button className={styles.tab} type="button">Gambar</button>
            <button className={styles.tab} type="button">Pengaturan</button>
          </div>
          <div className={styles.formGrid}>{selected.fields.map(field => <Field key={field.key} field={field} />)}</div>
          <div className={styles.editorFooter}>
            <button type="button" className={styles.secondaryButton}>Simpan Draft</button>
            <button type="button" className={styles.secondaryButton}>Preview</button>
            <button type="button" className={styles.primaryButton}>Simpan Perubahan</button>
          </div>
        </section>
      </div>
    </>
  );
}
