"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../styles/auth/ForgotPassword.module.css";

type ApiResponse = { success?: boolean; message?: string };

export default function ForgotPassword() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? "id";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return setError("Email wajib diisi.");

    const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBase}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, locale }),
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok || !data.success) throw new Error(data.message ?? "Gagal mengirim email reset password.");

      setSuccess(data.message ?? "Link reset password sudah dikirim. Silakan cek email kamu.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={`${styles.recoveryPage} ${styles.forgotBackground}`}>
      <section className={styles.recoveryPanel}>
        <h1 className={styles.recoveryTitle}>Forgot<br />Your Password?</h1>

        <form className={styles.recoveryForm} onSubmit={handleSubmit}>
          <input
            className={styles.recoveryInput}
            type="email"
            placeholder="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); setSuccess(""); }}
          />

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <button className={styles.recoveryButton} type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Email"}
          </button>

          <button className={styles.recoveryBack} type="button" onClick={() => router.push(`/${locale}/login`)}>
            Back to sign in
          </button>
        </form>
      </section>
    </main>
  );
}
