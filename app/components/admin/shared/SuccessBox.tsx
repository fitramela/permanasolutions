import styles from "@/app/styles/admin/AdminUI.module.css";

export default function SuccessBox({ message }: { message: string }) {
  if (!message) return null;
  return <div className={styles.successBox}>{message}</div>;
}
