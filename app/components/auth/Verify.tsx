"use client";

import { useVerification } from "@/app/hooks/auth/useVerification";

import styles from "../../styles/auth/Verify.module.css";

export default function Verify() {
  const {
    otp,
    inputRefs,

    qrCode,
    setupRequired,
    isLoadingQr,

    verificationMethod,

    isVerifying,
    isSendingEmailOtp,

    emailOtpSent,
    emailResendSeconds,

    error,
    successMessage,

    isOtpComplete,

    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,

    handleVerification,
    handleSendEmailOtp,
    handleBackToLogin,
  } = useVerification();

  return (
    <main
      className={
        styles.verifyPage
      }
    >
      <section
        className={
          styles.verifyCard
        }
      >
        {/* ======================
            PANEL KIRI
        ====================== */}

        <div
          className={
            styles.qrPanel
          }
        >
          <div
            className={
              styles.qrContent
            }
          >
            <p
              className={
                styles.stepLabel
              }
            >
              LANGKAH KEAMANAN
            </p>

            <h1
              className={
                styles.qrTitle
              }
            >
              {setupRequired
                ? "Hubungkan aplikasi autentikator"
                : "Verifikasi akun Anda"}
            </h1>

            <p
              className={
                styles.qrDescription
              }
            >
              {setupRequired
                ? "Pindai QR Code menggunakan Google Authenticator atau aplikasi autentikator lainnya."
                : "Akun ini sudah terhubung dengan aplikasi autentikator."}
            </p>

            {setupRequired && (
              <div
                className={
                  styles.qrBox
                }
              >
                {isLoadingQr ? (
                  <div
                    className={
                      styles.qrLoading
                    }
                  >
                    <span
                      className={
                        styles.qrLoader
                      }
                    />

                    <p>
                      Menyiapkan
                      QR...
                    </p>
                  </div>
                ) : qrCode ? (
                  <img
                    src={qrCode}
                    alt="QR Code verifikasi dua langkah"
                  />
                ) : (
                  <p
                    className={
                      styles.qrEmpty
                    }
                  >
                    QR Code tidak
                    tersedia.
                  </p>
                )}
              </div>
            )}

            {!setupRequired && (
              <div
                className={
                  styles.connectedBox
                }
              >
                <span>
                  ✓
                </span>

                <p>
                  Aplikasi
                  autentikator
                  sudah
                  terhubung.
                </p>
              </div>
            )}

            <div
              className={
                styles.qrInstruction
              }
            >
              <span>
                1
              </span>

              <p>
                Buka aplikasi
                autentikator.
              </p>
            </div>

            <div
              className={
                styles.qrInstruction
              }
            >
              <span>
                2
              </span>

              <p>
                Pindai QR dan
                masukkan kode
                enam digit.
              </p>
            </div>
          </div>
        </div>

        {/* ======================
            PANEL KANAN
        ====================== */}

        <div
          className={
            styles.verificationPanel
          }
        >
          <div
            className={
              styles.qrBrand
            }
          >
            <img
              src="/images/logo.png"
              alt="Logo aplikasi"
              className={
                styles.qrLogoImage
              }
            />
          </div>

          <div
            className={
              styles.verificationContent
            }
          >
            <p
              className={
                styles.verificationLabel
              }
            >
              VERIFIKASI AKUN
            </p>

            <h2
              className={
                styles.verificationTitle
              }
            >
              {verificationMethod ===
              "email"
                ? "Masukkan kode dari email"
                : "Masukkan kode autentikasi"}
            </h2>

            <p
              className={
                styles.verificationDescription
              }
            >
              {verificationMethod ===
              "email"
                ? "Masukkan kode enam digit yang telah dikirim ke email terdaftar Anda."
                : "Masukkan kode enam digit yang ditampilkan pada aplikasi autentikator Anda."}
            </p>

            <form
              onSubmit={
                handleVerification
              }
              className={
                styles.verifyForm
              }
            >
              {/* OTP INPUT */}

              <div
                className={
                  styles.otpWrapper
                }
              >
                {otp.map(
                  (
                    value,
                    index
                  ) => (
                    <input
                      key={
                        index
                      }
                      ref={(
                        element
                      ) => {
                        inputRefs.current[
                          index
                        ] =
                          element;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={
                        1
                      }
                      value={
                        value
                      }
                      autoFocus={
                        index ===
                        0
                      }
                      autoComplete={
                        index ===
                        0
                          ? "one-time-code"
                          : "off"
                      }
                      aria-label={`Digit kode ke-${
                        index +
                        1
                      }`}
                      onChange={(
                        event
                      ) =>
                        handleOtpChange(
                          event,
                          index
                        )
                      }
                      onKeyDown={(
                        event
                      ) =>
                        handleOtpKeyDown(
                          event,
                          index
                        )
                      }
                      onPaste={
                        handleOtpPaste
                      }
                    />
                  )
                )}
              </div>

              {/* INFO */}

              <div
                className={
                  styles.codeInformation
                }
              >
                <span>
                  i
                </span>

                <p>
                  {verificationMethod ===
                  "email"
                    ? "Gunakan kode terbaru yang dikirim ke email Anda."
                    : "Kode akan berubah secara otomatis setiap beberapa detik."}
                </p>
              </div>

              {/* SUCCESS */}

              {successMessage && (
                <div
                  className={
                    styles.verificationSuccess
                  }
                  role="status"
                >
                  {
                    successMessage
                  }
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div
                  className={
                    styles.verificationError
                  }
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* VERIFY BUTTON */}

              <div
                className={
                  styles.verifyAction
                }
              >
                <button
                  type="submit"
                  className={`${styles.verifyButton} ${
                    isVerifying
                      ? styles.loading
                      : ""
                  }`}
                  disabled={
                    !isOtpComplete ||
                    isVerifying ||
                    (verificationMethod ===
                      "authenticator" &&
                      setupRequired &&
                      isLoadingQr)
                  }
                >
                  {isVerifying ? (
                    <>
                      <span
                        className={
                          styles.verifyLoader
                        }
                      />

                      <span>
                        Memverifikasi...
                      </span>
                    </>
                  ) : verificationMethod ===
                    "email" ? (
                    "Verifikasi kode email"
                  ) : setupRequired ? (
                    "Verifikasi & aktifkan 2FA"
                  ) : (
                    "Verifikasi & masuk"
                  )}
                </button>
              </div>
            </form>

            {/* ==================
                EMAIL OPTION
            ================== */}

            <div
              className={
                styles.emailOption
              }
            >
              <div
                className={
                  styles.emailDivider
                }
              >
                <span />

                <p>
                  atau
                </p>

                <span />
              </div>

              <p
                className={
                  styles.emailOptionDescription
                }
              >
                Meski lebih
                disarankan
                menggunakan
                aplikasi
                autentikator,
                Anda juga dapat
                melakukan
                verifikasi
                melalui email.
              </p>

              <button
                type="button"
                className={
                  styles.emailOtpButton
                }
                onClick={
                  handleSendEmailOtp
                }
                disabled={
                  isSendingEmailOtp ||
                  emailResendSeconds >
                    0
                }
              >
                {isSendingEmailOtp
                  ? "Mengirim kode..."
                  : emailResendSeconds >
                      0
                    ? `Kirim ulang dalam 00:${String(
                        emailResendSeconds
                      ).padStart(
                        2,
                        "0"
                      )}`
                    : emailOtpSent
                      ? "Kirim ulang kode via email"
                      : "Kirim kode via email"}
              </button>
            </div>

            {/* BACK */}

            <button
              type="button"
              className={
                styles.backButton
              }
              onClick={
                handleBackToLogin
              }
            >
              Kembali ke halaman
              login
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}