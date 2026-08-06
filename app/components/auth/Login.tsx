"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

type LoginResponse = {
  success?: boolean;
  message?: string;
  userId?: string | number;
  needsSetup?: boolean;
  needsOtp?: boolean;
  qrCode?: string;
};

const slides = [
  "/images/contact2.png",
  "/images/image 684.png",
  "/images/image 695.png",
  "/images/image 703.png",
  "/images/image 44.png",
];

export default function Login() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();

  const locale = params?.locale ?? "id";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [activeSlide, setActiveSlide] =
    useState(0);

  /*
    Slider otomatis berganti setiap 5 detik.
  */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((currentSlide) => {
        return (currentSlide + 1) % slides.length;
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
    Proses login mengikuti respons backend 2FA:
    userId, needsSetup, needsOtp, dan qrCode.
  */
  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email wajib diisi.");
      return;
    }

    if (!password) {
      setError("Password wajib diisi.");
      return;
    }

    const apiUrl = "http://localhost:4000";

    if (!apiUrl) {
      setError(
        "NEXT_PUBLIC_API_URL belum dikonfigurasi."
      );
      return;
    }

    setIsLoading(true);

    try {
      const apiBase =
        apiUrl.replace(/\/$/, "");

      const response = await fetch(
        `${apiBase}/api/auth/login`,
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

      if (!response.ok || !data.success) {
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

      if (!data.needsSetup && !data.needsOtp) {
        throw new Error(
          "Status verifikasi 2FA tidak diterima."
        );
      }

      sessionStorage.setItem(
        "twoFactorUserId",
        String(data.userId)
      );

      // Simpan email login agar halaman verify dapat
      // mengirim dan memverifikasi OTP melalui email.
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

      router.push(`/${locale}/verify`);
    } catch (loginError) {
      const message =
        loginError instanceof Error
          ? loginError.message
          : "Terjadi kesalahan saat login.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <main className="login-page">
        <section className="login-card">
          {/* BAGIAN FORM LOGIN */}

          <div className="login-form-section">
            <div className="form-content">
              <div className="brand">
                <img
                  className="brand-logo"
                  src="/images/logo.png"
                  alt="Permana Solutions"
                />
              </div>

              <div className="form-heading">

                <h1>Selamat datang kembali</h1>

                <p className="heading-description">
                  Masukkan email dan password untuk
                  melanjutkan ke verifikasi keamanan.
                </p>
              </div>

              <form
                className="login-form"
                onSubmit={handleLogin}
              >
                <div className="form-group">
                  <label htmlFor="email">
                    Alamat email
                  </label>

                  <div className="input-container">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="nama@email.com"
                      autoComplete="email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    Password
                  </label>

                  <div className="input-container">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      placeholder="Masukkan password"
                      autoComplete="current-password"
                      onChange={(event) => {
                        setPassword(
                          event.target.value
                        );

                        setError("");
                      }}
                    />

                    <button
                      type="button"
                      className="show-password-button"
                      onClick={() => {
                        setShowPassword(
                          (currentValue) =>
                            !currentValue
                        );
                      }}
                    >
                      {showPassword
                        ? "Sembunyikan"
                        : "Lihat"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="error-message"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="button-loader" />
                      Memeriksa akun...
                    </>
                  ) : (
                    <>
                      Login
                    </>
                  )}
                </button>
              </form>

              <div className="security-information">
                <span className="security-icon">
                  ✓
                </span>

                <p>
                  Dilindungi dengan verifikasi
                  keamanan dua langkah.
                </p>
              </div>
            </div>
          </div>

          {/* BAGIAN SLIDER GAMBAR */}

          <div className="slider-section">
            <div className="slider-container">
              <div className="slides-wrapper">
                {slides.map((image, index) => (
                  <div
                    key={image}
                    className={`slide ${
                      activeSlide === index
                        ? "slide-active"
                        : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="slide-image"
                    />
                  </div>
                ))}
              </div>

              <div className="slider-navigation">
                <div className="slider-dots">
                  {slides.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      aria-label={`Tampilkan slide ${index + 1}`}
                      className={`slider-dot ${
                        activeSlide === index
                          ? "slider-dot-active"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveSlide(index);
                      }}
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
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
          --error-background: #fff0f0;
          --error-text: #a03333;

          width: 100%;
          height: 100vh;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          background:
            radial-gradient(
              circle at 7% 8%,
              rgba(15, 197, 194, 0.18),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 92%,
              rgba(7, 105, 141, 0.12),
              transparent 25%
            ),
            var(--background);
        }

        button,
        input {
          font-family: inherit;
        }

        .login-card {
          width: min(1080px, 100%);
          height: min(650px, calc(100vh - 64px));
          max-height: calc(100vh - 64px);

          display: grid;
          grid-template-columns:
            minmax(360px, 0.88fr)
            minmax(420px, 1.12fr);

          overflow: hidden;

          border: 1px solid rgba(7, 105, 141, 0.08);
          border-radius: 26px;
          background: var(--white);

          box-shadow:
            0 22px 65px
            rgba(5, 72, 95, 0.14);
        }

        /* FORM LOGIN */

        .login-form-section {
          position: relative;

          display: flex;
          align-items: center;

          min-width: 0;
          min-height: 0;

          overflow-y: auto;
          overflow-x: hidden;

          padding: 38px 44px;

          background: var(--white);
        }


        .form-content {
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
        }

        .brand {
          width: 100%;
          margin-bottom: 26px;
        }

        .brand-logo {
          width: min(230px, 100%);
          height: auto;
          display: block;
          object-fit: contain;
          object-position: left center;
        }


        .heading-label {
          margin: 0 0 10px;

          color: var(--navy);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }

        .form-heading h1 {
          margin: 0;

          color: var(--text);
          font-size: clamp(27px, 2.3vw, 36px);
          line-height: 1.12;
          letter-spacing: -0.035em;
        }

        .heading-description {
          max-width: 370px;

          margin: 10px 0 22px;

          color: var(--muted);
          font-size: 13px;
          line-height: 1.55;
        }

        .login-form {
          display: grid;
          gap: 14px;
        }

        .form-group {
          display: grid;
          gap: 12px;
        }

        .form-group label {
          color: var(--text);
          font-size: 14px;
          font-weight: 700;
        }




        .input-container {
          min-height: 52px;

          display: flex;
          align-items: center;
          gap: 12px;

          padding: 0 17px;

          border:
            1px solid var(--border);

          border-radius: 15px;

          background: #fbfefe;

          transition:
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .input-container:focus-within {
          border-color: var(--turquoise);

          background: var(--white);

          box-shadow:
            0 0 0 4px
            rgba(15, 197, 194, 0.13);
        }



        .input-container input {
          width: 100%;
          min-width: 0;

          border: none;
          outline: none;

          color: var(--text);
          font-size: 15px;

          background: transparent;
        }

        .input-container input::placeholder {
          color: #9cabb0;
        }

        .show-password-button {
          flex-shrink: 0;

          padding: 5px;

          border: none;

          color: var(--navy);
          font-size: 12px;
          font-weight: 800;

          background: transparent;
          cursor: pointer;
        }

        .error-message {
          margin-top: -4px;
          padding: 12px 14px;

          border:
            1px solid
            rgba(160, 51, 51, 0.1);

          border-radius: 12px;

          color: var(--error-text);
          font-size: 13px;
          line-height: 1.5;

          background:
            var(--error-background);
        }

        .login-button {
          width: 100%;
          min-height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;

          margin-top: 6px;

          border: none;
          border-radius: 15px;

          color: var(--white);
          font-size: 15px;
          font-weight: 800;

          background:
            linear-gradient(
              135deg,
              var(--navy),
              var(--turquoise)
            );

          box-shadow:
            0 14px 30px
            rgba(7, 105, 141, 0.23);

          cursor: pointer;

          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            opacity 180ms ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 18px 36px
            rgba(7, 105, 141, 0.3);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }


        .button-loader {
          width: 17px;
          height: 17px;

          border:
            2px solid
            rgba(255, 255, 255, 0.4);

          border-top-color:
            var(--white);

          border-radius: 50%;

          animation:
            login-spin 700ms linear infinite;
        }

        @keyframes login-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .security-information {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          margin-top: 16px;

          color: var(--muted);
        }

        .security-information p {
          margin: 0;
          font-size: 12px;
        }

        .security-icon {
          width: 18px;
          height: 18px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: var(--navy);
          font-size: 11px;
          font-weight: 800;

          background:
            rgba(15, 197, 194, 0.15);
        }

        /* SLIDER */

        .slider-section {
          min-width: 0;
          min-height: 0;
          height: 100%;

          display: flex;
          align-items: stretch;
          justify-content: stretch;

          padding: 0;
          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              rgba(15, 197, 194, 0.12),
              transparent 52%
            ),
            var(--navy);
        }

        .slider-container {
          position: relative;

          width: 100%;
          height: 100%;
          min-width: 0;
          min-height: 0;

          display: grid;
          grid-template-rows: minmax(0, 1fr) 64px;

          overflow: hidden;

          border: none;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }

        .slides-wrapper {
          position: relative;

          width: 100%;
          min-width: 0;
          min-height: 0;

          overflow: hidden;

          border: none;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }

        .slide {
          position: absolute;
          inset: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 26px 26px 12px;

          opacity: 0;
          visibility: hidden;
          transform: scale(0.985);

          transition:
            opacity 700ms ease,
            visibility 700ms ease,
            transform 700ms ease;
        }

        .slide-active {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
        }

        .slide-image {
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;

          display: block;

          object-fit: contain;
          object-position: center;

          border: none;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }

        .slider-navigation {
          position: relative;
          inset: auto;
          z-index: 6;

          width: 100%;
          min-height: 64px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 14px 20px 18px;

          background: transparent;
          border: none;
          box-shadow: none;
        }

        .slider-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .slider-dot {
          width: 8px;
          height: 8px;

          padding: 0;

          border: none;
          border-radius: 50px;

          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;

          transition:
            width 250ms ease,
            background 250ms ease,
            transform 250ms ease;
        }

        .slider-dot:hover {
          transform: scale(1.15);
        }

        .slider-dot-active {
          width: 25px;
          background: var(--turquoise);
        }




        @media (max-height: 760px) and (min-width: 1051px) {
          .login-page {
            padding: 16px;
          }

          .login-card {
            height: calc(100vh - 32px);
            max-height: calc(100vh - 32px);
          }

          .login-form-section {
            padding: 24px 40px;
          }

          .brand {
            margin-bottom: 22px;
          }

          .form-heading {
            margin-bottom: 20px;
          }


          .heading-description {
            margin-top: 10px;
            line-height: 1.5;
          }

          .login-form {
            gap: 13px;
          }

          .input-container,
          .login-button {
            min-height: 48px;
          }

          .security-information {
            margin-top: 12px;
          }

          .slider-section {
            padding: 0;
          }

          .slider-container {
            grid-template-rows: minmax(0, 1fr) 54px;
          }

          .slide {
            padding: 18px 20px 8px;
          }

          .slider-navigation {
            min-height: 54px;
            padding: 10px 20px 14px;
          }
        }

        /* TABLET */

        @media (max-width: 1050px) {
          .login-page {
            padding: 18px;
          }

          .login-card {
            grid-template-columns: 1fr;
          }

          .login-form-section {
            min-height: 720px;
            padding: 55px 40px;
          }

          .slider-section {
            min-height: 600px;
            padding: 0;
          }

          .slider-container {
            min-height: 600px;
          }
        }

        /* MOBILE */

        @media (max-width: 650px) {
          .login-page {
            padding: 0;
            align-items: stretch;
          }

          .login-card {
            min-height: 100vh;

            border: none;
            border-radius: 0;

            box-shadow: none;
          }

          .login-form-section {
            min-height: 100vh;
            padding: 34px 22px 45px;
          }


          .brand {
            margin-bottom: 48px;
          }

          .form-heading h1 {
            font-size: 36px;
          }

          .heading-description {
            font-size: 14px;
          }

          .slider-section {
            display: none;
          }

          .password-heading {
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}