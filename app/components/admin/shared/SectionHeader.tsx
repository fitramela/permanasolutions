import type { ReactNode } from "react";
import styles from "@/app/styles/admin/AdminUI.module.css";

export default function SectionHeader({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className={styles.sectionHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {desc && <p className={styles.pageDescription}>{desc}</p>}
      </div>
      {action && <div className={styles.headerAction}>{action}</div>}
    </div>
  );
}
