import type { ReactNode } from "react";
import styles from "@/app/styles/admin/AdminUI.module.css";

export default function EmptyState({ children }: { children: ReactNode }) {
  return <div className={styles.emptyState}>{children}</div>;
}
