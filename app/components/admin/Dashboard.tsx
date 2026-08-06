import styles from "./AdminUI.module.css";

export default function Dashboard() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1>Dashboard</h1>
          <p>Halaman dashboard sengaja dikosongkan untuk tahap awal.</p>
        </div>
      </div>
      <div className={styles.emptyDashboard} aria-label="Dashboard kosong" />
    </>
  );
}
