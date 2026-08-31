import styles from "@/app/styles/admin/AdminUI.module.css";

export default function LoadingState({ text = "Memuat data..." }: { text?: string }) {
  return <div className={styles.loadingBox}>{text}</div>;
}
