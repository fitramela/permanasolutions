import styles from "@/app/styles/admin/AdminUI.module.css";

export default function ErrorBox({ message }: { message: string }) {
  if (!message) return null;
  return <div className={styles.errorBox}>{message}</div>;
}
