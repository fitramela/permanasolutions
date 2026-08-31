"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../styles/auth/Login.module.css";

type LoginResponse = {
  success?: boolean;
  message?: string;
  userId?: string | number;
  needsSetup?: boolean;
  needsOtp?: boolean;
  qrCode?: string;
};

export default function Login() {
  const router = useRouter();

  const params = useParams<{
    locale?: string;
  }>();

  const locale = params?.locale ?? "id";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000"
    ).replace(/\/$/, "");

    setIsLoading(true);

    try {
      const response = await fetch(
        `${apiBase}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        }
      );

      let data: LoginResponse;

      try {
        data =
          (await response.json()) as LoginResponse;
      } catch {
        throw new Error(
          "Respons server tidak valid."
        );
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ??
            "Email atau password tidak benar."
        );
      }

      if (
        data.userId === undefined ||
        data.userId === null
      ) {
        throw new Error(
          "User ID tidak diterima dari server."
        );
      }

      if (
        !data.needsSetup &&
        !data.needsOtp
      ) {
        throw new Error(
          "Status verifikasi 2FA tidak diterima."
        );
      }

      sessionStorage.setItem(
        "twoFactorUserId",
        String(data.userId)
      );

      sessionStorage.setItem(
        "twoFactorEmail",
        normalizedEmail
      );

      sessionStorage.setItem(
        "twoFactorNeedsSetup",
        String(Boolean(data.needsSetup))
      );

      if (data.needsSetup) {
        if (!data.qrCode) {
          throw new Error(
            "QR Code tidak diterima dari server."
          );
        }

        sessionStorage.setItem(
          "twoFactorQrCode",
          data.qrCode
        );
      } else {
        sessionStorage.removeItem(
          "twoFactorQrCode"
        );
      }

      router.push(
        `/${locale}/verify`
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat login.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginLayout}>
        {/* =========================
            GAMBAR KIRI
        ========================== */}

        <div className={styles.loginVisual}>
          <div className={styles.visualContainer}>
            {/* GLOW */}
            <div className={styles.visualGlow} />

            {/* GAMBAR UTAMA */}
            <img
              src="/images/permana-1.png"
              alt="Permana Solutions"
              className={styles.visualImage}
              draggable={false}
            />

            {/* GLASS SHINE */}
            <div className={styles.visualShine} />
          </div>
        </div>

        {/* =========================
            LOGIN CARD
        ========================== */}

        <div className={styles.loginCard}>
          {/* =========================
              LOGO
          ========================== */}

          <div className={styles.brand}>
            <img
              src="/images/logo.png"
              alt="Permana Solutions"
              draggable={false}
            />
          </div>

          {/* =========================
              FORM LOGIN
          ========================== */}

          <form
            className={styles.form}
            onSubmit={handleLogin}
          >
            {/* EMAIL */}

            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              disabled={isLoading}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
            />

            {/* PASSWORD */}

            <div className={styles.passwordWrap}>
              <input
                className={styles.input}
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                disabled={isLoading}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );

                  setError("");
                }}
              />

              <button
                type="button"
                className={styles.showButton}
                disabled={isLoading}
                onClick={() => {
                  setShowPassword(
                    (current) => !current
                  );
                }}
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>
            </div>

            {/* =========================
                ERROR
            ========================== */}

            {error && (
              <div
                className={styles.error}
                role="alert"
              >
                {error}
              </div>
            )}

            {/* =========================
                SIGN IN
            ========================== */}

            <button
              type="submit"
              className={`${styles.submit} ${
                isLoading
                  ? styles.loading
                  : ""
              }`}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className={styles.spinner}
                    aria-hidden="true"
                  />

                  <span>
                    Signing in...
                  </span>
                </>
              ) : (
                "Sign in"
              )}
            </button>

            {/* =========================
                FORGOT PASSWORD
            ========================== */}

            <button
              type="button"
              className={styles.forgotLink}
              disabled={isLoading}
              onClick={() => {
                router.push(
                  `/${locale}/forgot-password`
                );
              }}
            >
              Forgot password?
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}