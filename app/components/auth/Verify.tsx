"use client";

import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

type VerifyResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  retryAfter?: number;
  user?: {
    id?: string | number;
    email?: string;
    [key: string]: unknown;
  };
};

const OTP_LENGTH = 6;
const EMAIL_RESEND_COOLDOWN = 60;

type VerificationMethod = "authenticator" | "email";

export default function Verify() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();

  const locale = params?.locale ?? "id";

  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [qrCode, setQrCode] = useState("");
  const [setupRequired, setSetupRequired] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(true);

  const [isVerifying, setIsVerifying] =
    useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("authenticator");
  const [isSendingEmailOtp, setIsSendingEmailOtp] =
    useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailResendSeconds, setEmailResendSeconds] = useState(0);

  const inputRefs =
    useRef<Array<HTMLInputElement | null>>([]);

  /*
    Data verifikasi berasal dari respons login.

    Login harus menyimpan:
    - twoFactorUserId
    - twoFactorEmail
    - twoFactorNeedsSetup
    - twoFactorQrCode, hanya jika needsSetup = true
  */
  useEffect(() => {
    const storedUserId =
      sessionStorage.getItem("twoFactorUserId");

    const storedEmail =
      sessionStorage.getItem("twoFactorEmail");

    const storedNeedsSetup =
      sessionStorage.getItem("twoFactorNeedsSetup");

    const storedQrCode =
      sessionStorage.getItem("twoFactorQrCode") ?? "";

    // Halaman tetap dapat dipakai untuk OTP email meskipun userId tidak tersedia.
    // Minimal harus ada userId (autentikator) atau email (OTP email).
    if (!storedUserId && !storedEmail) {
      router.replace(`/${locale}/login`);
      return;
    }

    const needsSetup = storedNeedsSetup === "true";

    setUserId(storedUserId);
    setUserEmail(storedEmail);
    setSetupRequired(needsSetup);
    setQrCode(needsSetup ? storedQrCode : "");
    setIsLoadingQr(false);
  }, [locale, router]);

  useEffect(() => {
    const cooldownUntil = Number(
      sessionStorage.getItem("emailOtpCooldownUntil") ?? "0"
    );

    setEmailResendSeconds(
      Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
    );
  }, []);

  useEffect(() => {
    if (emailResendSeconds <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setEmailResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [emailResendSeconds]);

  function handleOtpChange(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const number = event.target.value
      .replace(/\D/g, "")
      .slice(-1);

    const updatedOtp = [...otp];

    updatedOtp[index] = number;

    setOtp(updatedOtp);
    setError("");
    setSuccessMessage("");

    if (
      number &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpPaste(
    event: ClipboardEvent<HTMLInputElement>
  ) {
    event.preventDefault();

    const pastedValue =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, OTP_LENGTH);

    if (!pastedValue) {
      return;
    }

    const updatedOtp =
      Array(OTP_LENGTH)
        .fill("")
        .map((_, index) => {
          return pastedValue[index] ?? "";
        });

    setOtp(updatedOtp);
    setError("");
    setSuccessMessage("");

    const lastFilledIndex =
      Math.min(
        pastedValue.length,
        OTP_LENGTH
      ) - 1;

    inputRefs.current[
      lastFilledIndex
    ]?.focus();
  }

  async function verifyCode(code: string) {
    if (!/^\d{6}$/.test(code)) {
      setError(
        verificationMethod === "email"
          ? "Masukkan 6 digit kode OTP dari email."
          : "Masukkan 6 digit kode autentikator."
      );
      return;
    }

    if (verificationMethod === "email" && !userEmail) {
      setError("Email login tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (verificationMethod === "authenticator" && !userId) {
      setError("Sesi autentikator tidak ditemukan. Gunakan OTP email atau login kembali.");
      return;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000";

    setError("");
    setIsVerifying(true);

    try {
      const apiBase =
        `${apiUrl.replace(/\/$/, "")}/api/auth`;

      const endpoint =
        verificationMethod === "email"
          ? `${apiBase}/verify-otp`
          : setupRequired
            ? `${apiBase}/setup-totp`
            : `${apiBase}/verify-totp`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          verificationMethod === "email"
            ? { email: userEmail, code }
            : { userId, token: code }
        ),
      });

      const data =
        (await response.json()) as VerifyResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ?? "Kode yang Anda masukkan tidak sesuai."
        );
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      if (data.user) {
        localStorage.setItem(
          "authUser",
          JSON.stringify(data.user)
        );
      }

      sessionStorage.removeItem("twoFactorUserId");
      sessionStorage.removeItem("twoFactorEmail");
      sessionStorage.removeItem("twoFactorNeedsSetup");
      sessionStorage.removeItem("twoFactorQrCode");
      sessionStorage.removeItem("emailOtpCooldownUntil");

      router.replace(`/${locale}/admin`);
    } catch (verificationError) {
      const message =
        verificationError instanceof Error
          ? verificationError.message
          : "Terjadi kesalahan jaringan.";

      setError(message);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleVerification(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    await verifyCode(otp.join(""));
  }

  useEffect(() => {
    const code = otp.join("");

    if (code.length !== OTP_LENGTH || isVerifying) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void verifyCode(code);
    }, 250);

    return () => window.clearTimeout(timeoutId);
    // verifyCode sengaja tidak dimasukkan agar verifikasi hanya berjalan
    // saat enam digit OTP berubah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, isVerifying]);

  async function handleSendEmailOtp() {
    if (!userEmail) {
      setError(
        "Email login tidak ditemukan. Silakan login kembali."
      );
      return;
    }

    if (emailResendSeconds > 0 || isSendingEmailOtp) {
      return;
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000";

    setError("");
    setSuccessMessage("");
    setIsSendingEmailOtp(true);

    try {
      const apiBase =
        `${apiUrl.replace(/\/$/, "")}/api/auth`;

      const response = await fetch(
        `${apiBase}/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        }
      );

      let data: VerifyResponse = {};

      try {
        data = (await response.json()) as VerifyResponse;
      } catch {
        data = {};
      }

      if (!response.ok || !data.success) {
        /*
        * Kalau backend mengembalikan 429,
        * tombol dikunci lagi selama 60 detik.
        */
        if (response.status === 429) {
          const cooldownUntil =
            Date.now() + EMAIL_RESEND_COOLDOWN * 1000;

          setEmailResendSeconds(
            EMAIL_RESEND_COOLDOWN
          );

          sessionStorage.setItem(
            "emailOtpCooldownUntil",
            String(cooldownUntil)
          );
        }

        throw new Error(
          data.message ??
            (response.status === 429
              ? "Terlalu banyak permintaan OTP. Tunggu 1 menit lalu coba kembali."
              : "Kode OTP gagal dikirim melalui email.")
        );
      }

      setVerificationMethod("email");
      setEmailOtpSent(true);
      setEmailResendSeconds(
        EMAIL_RESEND_COOLDOWN
      );

      sessionStorage.setItem(
        "emailOtpCooldownUntil",
        String(
          Date.now() +
            EMAIL_RESEND_COOLDOWN * 1000
        )
      );

      setOtp(Array(OTP_LENGTH).fill(""));

      setSuccessMessage(
        data.message ??
          "Kode OTP telah dikirim ke email yang terdaftar."
      );

      window.setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Terjadi kesalahan saat mengirim kode OTP."
      );
    } finally {
      setIsSendingEmailOtp(false);
    }
  }

  function handleBackToLogin() {
    sessionStorage.removeItem("twoFactorUserId");
    sessionStorage.removeItem("twoFactorEmail");
    sessionStorage.removeItem("twoFactorNeedsSetup");
    sessionStorage.removeItem("twoFactorQrCode");

    router.replace(`/${locale}/login`);
  }

  return (
    <>
      <main className="verify-page">
        <section className="verify-card">
          {/* PANEL QR */}

          <div className="qr-panel">

            <div className="qr-content">
              <p className="step-label">
                LANGKAH KEAMANAN
              </p>

              <h1>
                {setupRequired
                  ? "Hubungkan aplikasi autentikator"
                  : "Verifikasi akun Anda"}
              </h1>

              <p className="qr-description">
                {setupRequired
                  ? "Pindai QR Code menggunakan Google Authenticator atau aplikasi autentikator lainnya."
                  : "Akun ini sudah terhubung dengan aplikasi autentikator."}
              </p>

              {setupRequired && (
                <div className="qr-box">
                  {isLoadingQr ? (
                    <div className="qr-loading">
                      <span className="qr-loader" />

                      <p>Menyiapkan QR...</p>
                    </div>
                  ) : qrCode ? (
                    <img
                      src={qrCode}
                      alt="QR Code verifikasi dua langkah"
                    />
                  ) : (
                    <p className="qr-empty">
                      QR Code tidak tersedia.
                    </p>
                  )}
                </div>
              )}

              {!setupRequired && (
                <div className="connected-box">
                  <span>✓</span>

                  <p>
                    Aplikasi autentikator sudah
                    terhubung.
                  </p>
                </div>
              )}

              <div className="qr-instruction">
                <span>1</span>

                <p>
                  Buka aplikasi autentikator.
                </p>
              </div>

              <div className="qr-instruction">
                <span>2</span>

                <p>
                  Pindai QR dan masukkan kode
                  enam digit.
                </p>
              </div>
            </div>
          </div>

          {/* PANEL KODE OTP */}

          <div className="verification-panel">

            <div className="qr-brand">
              <img
                src="/images/logo.png"
                alt="Logo aplikasi"
                className="qr-logo-image"
              />
            </div>

            <div className="verification-content">
              <span className="verification-line" />

              <p className="verification-label">
                VERIFIKASI AKUN
              </p>

              <h2>
                {verificationMethod === "email"
                  ? "Masukkan kode dari email"
                  : "Masukkan kode autentikasi"}
              </h2>

              <p className="verification-description">
                {verificationMethod === "email"
                  ? "Masukkan kode enam digit yang telah dikirim ke email terdaftar Anda."
                  : "Masukkan kode enam digit yang ditampilkan pada aplikasi autentikator Anda."}
              </p>

              <form
                onSubmit={handleVerification}
              >
                <div className="otp-wrapper">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] =
                          element;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={value}
                      autoFocus={index === 0}
                      autoComplete={
                        index === 0
                          ? "one-time-code"
                          : "off"
                      }
                      aria-label={`Digit kode ke-${
                        index + 1
                      }`}
                      onChange={(event) => {
                        handleOtpChange(
                          event,
                          index
                        );
                      }}
                      onKeyDown={(event) => {
                        handleOtpKeyDown(
                          event,
                          index
                        );
                      }}
                      onPaste={handleOtpPaste}
                    />
                  ))}
                </div>

                <div className="code-information">
                  <span>i</span>

                  <p>
                    {verificationMethod === "email"
                      ? "Gunakan kode terbaru yang dikirim ke email Anda."
                      : "Kode akan berubah secara otomatis setiap beberapa detik."}
                  </p>
                </div>

                {successMessage && (
                  <div
                    className="verification-success"
                    role="status"
                  >
                    {successMessage}
                  </div>
                )}

                {error && (
                  <div
                    className="verification-error"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <div className="verify-action">
                <button
                  type="submit"
                  className="verify-button"
                  disabled={
                    isVerifying ||
                    (verificationMethod === "authenticator" &&
                      setupRequired &&
                      isLoadingQr)
                  }
                >
                  {isVerifying ? (
                    <>
                      <span className="verify-loader" />
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      {verificationMethod === "email"
                        ? "Verifikasi kode email"
                        : setupRequired
                          ? "Verifikasi & aktifkan 2FA"
                          : "Verifikasi & masuk"}
                      <span>→</span>
                    </>
                  )}
                </button>
                </div>
              </form>

              <div className="email-option">
                <div className="email-divider">
                  <span />
                  <p>atau</p>
                  <span />
                </div>

                <p className="email-option-description">
                  Meski lebih disarankan menggunakan
                  aplikasi autentikator, Anda juga dapat
                  melakukan verifikasi melalui email.
                </p>

                <button
                  type="button"
                  className="email-otp-button"
                  onClick={handleSendEmailOtp}
                  disabled={
                    isSendingEmailOtp ||
                    emailResendSeconds > 0
                  }
                >
                  {isSendingEmailOtp
                    ? "Mengirim kode..."
                    : emailResendSeconds > 0
                      ? `Kirim ulang dalam 00:${String(
                          emailResendSeconds
                        ).padStart(2, "0")}`
                      : emailOtpSent
                        ? "Kirim ulang kode via email"
                        : "Kirim kode via email"}
                </button>
              </div>

              <button
                type="button"
                className="back-button"
                onClick={handleBackToLogin}
              >
                ← Kembali ke halaman login
              </button>

            </div>
          </div>
        </section>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .verify-page {
          --navy: #07698d;
          --navy-dark: #075674;
          --navy-deep: #064b65;
          --turquoise: #0fc5c2;
          --turquoise-light: #7ce4e0;
          --background: #effafa;
          --white: #ffffff;
          --text: #16333d;
          --muted: #698089;
          --border: #dbe9ea;

          width: 100%;
          min-width: 0;
          height: 100dvh;
          padding: 16px;

          display: grid;
          place-items: center;

          overflow-x: hidden;
          overflow-y: hidden;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(15, 197, 194, 0.17),
              transparent 26%
            ),
            radial-gradient(
              circle at 8% 90%,
              rgba(7, 105, 141, 0.13),
              transparent 27%
            ),
            var(--background);
        }

        button,
        input {
          font-family: inherit;
        }

        .verify-card {
          width: min(1440px, 100%);
          min-width: 0;
          height: calc(100dvh - 32px);
          max-height: calc(100dvh - 32px);

          display: grid;
          grid-template-columns:
            minmax(0, 0.92fr)
            minmax(0, 1.08fr);

          overflow: hidden;

          border:
            1px solid
            rgba(7, 105, 141, 0.08);

          border-radius: 28px;

          background: var(--white);

          box-shadow:
            0 22px 65px
            rgba(5, 72, 95, 0.14);
        }

        /* PANEL QR */

        .qr-panel {
          position: relative;

          display: flex;
          flex-direction: column;

          min-width: 0;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;

          padding: 32px 38px;

          color: var(--white);

          background:
            linear-gradient(
              145deg,
              rgba(15, 197, 194, 0.23),
              transparent 48%
            ),
            var(--navy);
        }

        .qr-panel::before {
          content: "";

          position: absolute;
          top: -105px;
          right: -95px;

          width: 240px;
          height: 240px;

          border:
            31px solid
            rgba(15, 197, 194, 0.2);

          border-radius: 50%;
        }

        .qr-brand {
          position: absolute;
          top: 32px;
          right: 38px;

          z-index: 100;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-logo-image {
          width: 170px;       
          height: auto;
          display: block;
          object-fit: contain;
          background: transparent;
          border: none;
          border-radius: 0;
          box-shadow: none;
        }

        .qr-logo-fallback {
          display: none;
        }

        .qr-logo-fallback {
          display: none;
          place-items: center;

          color: var(--navy);
          font-size: 20px;
          font-weight: 900;
        }

        .qr-brand:has(
          .qr-logo-image[style*="display: none"]
        )
        .qr-logo-fallback {
          display: grid;
        }

        .qr-brand-name {
          margin: 0;

          font-size: 17px;
          font-weight: 800;
        }

        .qr-brand-caption {
          margin: 2px 0 0;

          color:
            rgba(255, 255, 255, 0.68);

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .qr-content {
          width: 100%;
          max-width: 390px;

          margin: clamp(32px, 5vh, 58px) auto auto;

          padding: 0 0 8px;

          text-align: center;
        }

        .step-label {
          margin: 0 0 8px;

          color: var(--turquoise-light);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
        }

        .qr-content h1 {
          margin: 0;

          font-size:
            clamp(28px, 2.8vw, 39px);

          line-height: 1.12;
          letter-spacing: -0.04em;
        }

        .qr-description {
          max-width: 360px;

          margin: 12px auto 18px;

          color:
            rgba(255, 255, 255, 0.75);

          font-size: 13px;
          line-height: 1.6;
        }

        .qr-box {
          width: 220px;
          height: 220px;

          display: grid;
          place-items: center;

          margin: 0 auto 18px;
          padding: 16px;

          border-radius: 20px;

          color: var(--muted);

          background: var(--white);

          box-shadow:
            0 16px 34px
            rgba(3, 44, 59, 0.25);
        }

        .qr-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .qr-loading {
          display: grid;
          place-items: center;
          gap: 10px;
        }

        .qr-loading p {
          margin: 0;
          font-size: 12px;
        }

        .qr-loader {
          width: 26px;
          height: 26px;

          border:
            3px solid #dcebed;

          border-top-color:
            var(--turquoise);

          border-radius: 50%;

          animation:
            qr-spin 700ms linear infinite;
        }

        @keyframes qr-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .qr-empty {
          margin: 0;
          font-size: 12px;
        }

        .connected-box {
          max-width: 310px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          margin: 8px auto 24px;
          padding: 17px;

          border:
            1px solid
            rgba(255, 255, 255, 0.2);

          border-radius: 16px;

          background:
            rgba(255, 255, 255, 0.1);
        }

        .connected-box span {
          width: 29px;
          height: 29px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: var(--navy);
          font-weight: 900;

          background: var(--turquoise-light);
        }

        .connected-box p {
          margin: 0;
          font-size: 13px;
        }

        .qr-instruction {
          display: flex;
          align-items: center;
          gap: 9px;

          max-width: 300px;

          margin: 7px auto 0;

          text-align: left;
        }

        .qr-instruction span {
          width: 24px;
          height: 24px;

          display: grid;
          place-items: center;
          flex-shrink: 0;

          border-radius: 50%;

          color: var(--navy);
          font-size: 11px;
          font-weight: 900;

          background: var(--turquoise-light);
        }

        .qr-instruction p {
          margin: 0;

          color:
            rgba(255, 255, 255, 0.8);

          font-size: 12px;
          line-height: 1.4;
        }

        /* PANEL VERIFIKASI */

        .verification-panel {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          min-width: 0;
          min-height: 0;

          overflow-y: auto;
          overflow-x: hidden;

          padding: clamp(30px, 4vw, 56px);

          background: var(--white);
        }

        .verification-content {
          width: 100%;
          max-width: 520px;

          margin: 0 auto;

          panding-top: 45px;
        }

        .verification-line {
          width: 44px;
          height: 4px;

          display: block;

          margin-bottom: 15px;

          border-radius: 20px;

          background: var(--turquoise);
        }

        .verification-label {
          margin: 0 0 9px;

          color: var(--navy);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .verification-content h2 {
          margin: 0;

          color: var(--text);

          font-size:
            clamp(30px, 2.8vw, 42px);

          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .verification-description {
          max-width: 470px;

          margin: 13px 0 27px;

          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .otp-wrapper {
          display: grid;
          grid-template-columns:
            repeat(6, minmax(0, 1fr));

          gap: 9px;
        }

        .otp-wrapper input {
          width: 100%;
          min-width: 0;
          height: 58px;

          border:
            1px solid var(--border);

          border-radius: 13px;
          outline: none;

          color: var(--navy-dark);
          font-size: 24px;
          font-weight: 800;
          text-align: center;

          background: #fbfefe;

          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            transform 180ms ease;
        }

        .otp-wrapper input:focus {
          border-color: var(--turquoise);

          background: var(--white);

          box-shadow:
            0 0 0 4px
            rgba(15, 197, 194, 0.13);

          transform: translateY(-2px);
        }

        .code-information {
          display: flex;
          align-items: center;
          gap: 8px;

          margin-top: 14px;

          color: var(--muted);
        }

        .code-information span {
          width: 19px;
          height: 19px;

          display: grid;
          place-items: center;
          flex-shrink: 0;

          border-radius: 50%;

          color: var(--navy);
          font-size: 11px;
          font-weight: 800;

          background:
            rgba(15, 197, 194, 0.14);
        }

        .code-information p {
          margin: 0;
          font-size: 11px;
        }

        .verification-error {
          margin-top: 16px;
          padding: 11px 13px;

          border-radius: 11px;

          color: #a03333;
          font-size: 12px;
          line-height: 1.45;

          background: #fff0f0;
        }

        .verify-action {
          display: flex;
          justify-content: flex-start;
        }

        .verify-button {
          width: auto;
          min-width: 100%;
          max-width: 100%;
          min-height: 50px;
          padding: 0 24px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          margin-top: 22px;

          border: none;
          border-radius: 14px;

          color: var(--white);
          font-size: 14px;
          font-weight: 800;

          background:
            linear-gradient(
              135deg,
              var(--navy),
              var(--turquoise)
            );

          box-shadow:
            0 12px 26px
            rgba(7, 105, 141, 0.23);

          cursor: pointer;

          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            opacity 180ms ease;
        }

        .verify-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 16px 32px
            rgba(7, 105, 141, 0.3);
        }

        .verify-button:disabled {
          opacity: 0.68;
          cursor: not-allowed;
        }

        .verify-loader {
          width: 16px;
          height: 16px;

          border:
            2px solid
            rgba(255, 255, 255, 0.4);

          border-top-color:
            var(--white);

          border-radius: 50%;

          animation:
            verify-spin 700ms linear infinite;
        }

        @keyframes verify-spin {
          to {
            transform: rotate(360deg);
          }
        }


        .verification-success {
          margin-top: 16px;
          padding: 11px 13px;
          border-radius: 11px;
          color: #075f59;
          font-size: 12px;
          line-height: 1.45;
          background: #e9fbf8;
        }

        .email-option {
          margin-top: 18px;
        }

        .email-divider {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
        }

        .email-divider span {
          height: 1px;
          background: var(--border);
        }

        .email-divider p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
        }

        .email-option-description {
          max-width: 430px;
          margin: 13px auto 11px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.55;
          text-align: center;
        }

        .email-otp-button {
          width: 100%;
          min-height: 44px;
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--navy-dark);
          font-size: 13px;
          font-weight: 800;
          background: var(--white);
          cursor: pointer;
          transition:
            border-color 180ms ease,
            background 180ms ease,
            transform 180ms ease;
        }

        .email-otp-button:hover:not(:disabled) {
          border-color: var(--turquoise);
          background: #f4fdfc;
          transform: translateY(-1px);
        }

        .email-otp-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .back-button {
          width: 100%;

          margin-top: 12px;
          padding: 7px;

          border: none;

          color: var(--navy);
          font-size: 12px;
          font-weight: 700;

          background: transparent;
          cursor: pointer;
        }

        .back-button:hover {
          text-decoration: underline;
        }

        .demo-information {
          margin: 11px 0 0;

          color: var(--muted);
          font-size: 11px;
          text-align: center;
        }

        .demo-information strong {
          color: var(--navy-dark);
        }

        @media (max-height: 760px) and (min-width: 1001px) {
          .verify-page {
            padding: 10px;
          }

          .verify-card {
            height: calc(100dvh - 20px);
            max-height: calc(100dvh - 20px);
          }

          .qr-panel {
            position: relative;

            display: flex;
            justify-content: center;
            align-items: center;

            min-width: 0;
            min-height: 0;

            overflow: hidden;

            padding: 48px;

            color: var(--white);

            background:
              linear-gradient(
                145deg,
                rgba(15,197,194,.23),
                transparent 48%
              ),
              var(--navy);
          }

          .qr-content {
            width: 100%;
            max-width: 420px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            text-align: center;

            margin: 0;
            padding: 0;
          }

          .qr-content h1 {
            font-size: 31px;
          }

          .qr-description {
            margin: 9px auto 13px;
            line-height: 1.45;
          }

          .qr-box {
            width: 250px;
            height: 250px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin: 22px 0;

            padding: 18px;

            border-radius: 22px;

            background: white;

            box-shadow:
              0 20px 45px rgba(0,0,0,.22);
          }

          .qr-instruction {
            width: 100%;
            max-width: 320px;

            display: flex;
            align-items: center;

            gap: 12px;

            margin-top: 12px;

            text-align: left;
          }

          .verification-panel {
            padding: 26px 42px;
          }

          .verification-line {
            margin-bottom: 12px;
          }

          .verification-description {
            margin: 10px 0 20px;
            line-height: 1.5;
          }

          .otp-wrapper input {
            height: 52px;
          }

          .code-information {
            margin-top: 12px;
          }

          .verify-button {
            min-height: 48px;
            margin-top: 18px;
          }

  
        .back-button {
            margin-top: 8px;
          }

          .demo-information {
            margin-top: 9px;
          }
        }

        /* TABLET */

        @media (max-width: 1000px) {
          .verify-page {
            min-height: 100vh;
            height: auto;
            padding: 18px;
            overflow-x: hidden;
            overflow-y: auto;
          }

          .verify-card {
            height: auto;
            max-height: none;
            grid-template-columns: 1fr;
          }

          .qr-panel {
            min-height: 560px;
            padding: 32px 28px;
            overflow: visible;
          }

          .verification-panel {
            min-height: 520px;
            padding: 50px 35px;
            overflow: visible;
          }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .verify-page {
            padding: 0;
          }

          .verify-card {
            min-height: 100vh;

            border: none;
            border-radius: 0;

            box-shadow: none;
          }

          .qr-panel {
            min-height: 590px;
            padding: 28px 22px;
          }

          .qr-content {
            padding-top: 30px;
          }

          .qr-box {
            width: 205px;
            height: 205px;
          }

          .verification-panel {
            min-height: 520px;
            padding: 44px 21px;
          }

          .verification-content h2 {
            font-size: 33px;
          }

          .otp-wrapper {
            gap: 6px;
          }

          .verify-button {
            width: 100%;
            min-width: 0;
          }

          .otp-wrapper input {
            height: 54px;

            border-radius: 11px;

            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}