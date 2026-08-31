"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/auth/ResetPassword.module.css";

type ApiResponse = {
  success?: boolean;
  message?: string;
};

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const searchParams = useSearchParams();

  const locale = params?.locale ?? "id";
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Token reset password tidak ditemukan.");
      return;
    }

    if (!password) {
      setError("Password baru wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (!confirmPassword) {
      setError("Konfirmasi password wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
    ).replace(/\/$/, "");

    setIsLoading(true);

    try {
      const response = await fetch(
        `${apiBase}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: password,
          }),
        }
      );

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ?? "Gagal mengubah password."
        );
      }

      router.replace(`/${locale}/login?reset=success`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      className={`${styles.recoveryPage} ${styles.resetBackground}`}
    >
      <section className={styles.recoveryPanel}>
        <h1 className={styles.recoveryTitle}>
          Reset Password
        </h1>

        <form
          className={styles.recoveryForm}
          onSubmit={handleSubmit}
        >
          <input
            className={styles.recoveryInput}
            type="password"
            placeholder="password baru"
            autoComplete="new-password"
            value={password}
            disabled={isLoading}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          <input
            className={styles.recoveryInput}
            type="password"
            placeholder="tulis ulang password"
            autoComplete="new-password"
            value={confirmPassword}
            disabled={isLoading}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
          />

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            className={styles.recoveryButton}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Mengubah..." : "ubah password"}
          </button>
        </form>
      </section>
    </main>
  );
}