"use client";

import {
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
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

type VerificationMethod =
  | "authenticator"
  | "email";

const OTP_LENGTH = 6;
const EMAIL_RESEND_COOLDOWN = 60;

export function useVerification() {
  const router = useRouter();

  const params = useParams<{
    locale?: string;
  }>();

  const locale =
    params?.locale ?? "id";

  const [otp, setOtp] =
    useState<string[]>(
      Array(OTP_LENGTH).fill("")
    );

  const [qrCode, setQrCode] =
    useState("");

  const [
    setupRequired,
    setSetupRequired,
  ] = useState(true);

  const [userId, setUserId] =
    useState<string | null>(null);

  const [
    userEmail,
    setUserEmail,
  ] = useState<string | null>(
    null
  );

  const [
    isLoadingQr,
    setIsLoadingQr,
  ] = useState(true);

  const [
    isVerifying,
    setIsVerifying,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    verificationMethod,
    setVerificationMethod,
  ] =
    useState<VerificationMethod>(
      "authenticator"
    );

  const [
    isSendingEmailOtp,
    setIsSendingEmailOtp,
  ] = useState(false);

  const [
    emailOtpSent,
    setEmailOtpSent,
  ] = useState(false);

  const [
    emailResendSeconds,
    setEmailResendSeconds,
  ] = useState(0);

  const inputRefs =
    useRef<
      Array<HTMLInputElement | null>
    >([]);

  /*
   * ============================
   * LOAD TWO FACTOR SESSION
   * ============================
   */

  useEffect(() => {
    const storedUserId =
      sessionStorage.getItem(
        "twoFactorUserId"
      );

    const storedEmail =
      sessionStorage.getItem(
        "twoFactorEmail"
      );

    const storedNeedsSetup =
      sessionStorage.getItem(
        "twoFactorNeedsSetup"
      );

    const storedQrCode =
      sessionStorage.getItem(
        "twoFactorQrCode"
      ) ?? "";

    if (
      !storedUserId &&
      !storedEmail
    ) {
      router.replace(
        `/${locale}/login`
      );

      return;
    }

    const needsSetup =
      storedNeedsSetup === "true";

    setUserId(storedUserId);

    setUserEmail(
      storedEmail
    );

    setSetupRequired(
      needsSetup
    );

    setQrCode(
      needsSetup
        ? storedQrCode
        : ""
    );

    setIsLoadingQr(false);
  }, [locale, router]);

  /*
   * ============================
   * LOAD EMAIL OTP COOLDOWN
   * ============================
   */

  useEffect(() => {
    const cooldownUntil =
      Number(
        sessionStorage.getItem(
          "emailOtpCooldownUntil"
        ) ?? "0"
      );

    setEmailResendSeconds(
      Math.max(
        0,
        Math.ceil(
          (
            cooldownUntil -
            Date.now()
          ) / 1000
        )
      )
    );
  }, []);

  /*
   * ============================
   * EMAIL OTP COUNTDOWN
   * ============================
   */

  useEffect(() => {
    if (
      emailResendSeconds <= 0
    ) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        setEmailResendSeconds(
          (seconds) =>
            Math.max(
              0,
              seconds - 1
            )
        );
      }, 1000);

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [emailResendSeconds]);

  /*
   * ============================
   * OTP INPUT
   * ============================
   */

  function handleOtpChange(
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const number =
      event.target.value
        .replace(/\D/g, "")
        .slice(-1);

    const updatedOtp = [
      ...otp,
    ];

    updatedOtp[index] =
      number;

    setOtp(updatedOtp);

    setError("");
    setSuccessMessage("");

    if (
      number &&
      index <
        OTP_LENGTH - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  }

  function handleOtpKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (
      event.key ===
        "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key ===
        "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key ===
        "ArrowRight" &&
      index <
        OTP_LENGTH - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
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
        .slice(
          0,
          OTP_LENGTH
        );

    if (!pastedValue) {
      return;
    }

    const updatedOtp =
      Array(OTP_LENGTH)
        .fill("")
        .map(
          (_, index) =>
            pastedValue[
              index
            ] ?? ""
        );

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

  /*
   * ============================
   * VERIFY CODE
   * ============================
   */

  async function verifyCode(
    code: string
  ) {
    if (
      !/^\d{6}$/.test(
        code
      )
    ) {
      setError(
        verificationMethod ===
          "email"
          ? "Masukkan 6 digit kode OTP dari email."
          : "Masukkan 6 digit kode autentikator."
      );

      return;
    }

    if (
      verificationMethod ===
        "email" &&
      !userEmail
    ) {
      setError(
        "Email login tidak ditemukan. Silakan login kembali."
      );

      return;
    }

    if (
      verificationMethod ===
        "authenticator" &&
      !userId
    ) {
      setError(
        "Sesi autentikator tidak ditemukan. Gunakan OTP email atau login kembali."
      );

      return;
    }

    const apiUrl =
      process.env
        .NEXT_PUBLIC_API_URL ??
      "http://localhost:4000";

    setError("");
    setSuccessMessage("");
    setIsVerifying(true);

    try {
      const apiBase =
        `${apiUrl.replace(
          /\/$/,
          ""
        )}/auth`;

      const endpoint =
        verificationMethod ===
        "email"
          ? `${apiBase}/verify-otp`
          : setupRequired
            ? `${apiBase}/setup-totp`
            : `${apiBase}/verify-totp`;

      const response =
        await fetch(
          endpoint,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                verificationMethod ===
                  "email"
                  ? {
                      email:
                        userEmail,
                      code,
                    }
                  : {
                      userId,
                      token:
                        code,
                    }
              ),
          }
        );

      const data =
        (await response.json()) as VerifyResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ??
            "Kode yang Anda masukkan tidak sesuai."
        );
      }

      /*
       * SIMPAN TOKEN
       */

      if (data.token) {
        localStorage.setItem(
          "authToken",
          data.token
        );
      }

      /*
       * SIMPAN USER
       */

      if (data.user) {
        localStorage.setItem(
          "authUser",
          JSON.stringify(
            data.user
          )
        );
      }

      /*
       * BERSIHKAN SESSION LOGIN
       */

      clearVerificationSession();

      sessionStorage.removeItem(
        "emailOtpCooldownUntil"
      );

      /*
       * MASUK ADMIN
       */

      router.replace(
        `/${locale}/admin`
      );
    } catch (
      verificationError
    ) {
      const message =
        verificationError instanceof
        Error
          ? verificationError.message
          : "Terjadi kesalahan jaringan.";

      setError(message);

      setOtp(
        Array(
          OTP_LENGTH
        ).fill("")
      );

      inputRefs.current[
        0
      ]?.focus();
    } finally {
      setIsVerifying(
        false
      );
    }
  }

  /*
   * ============================
   * SUBMIT VERIFICATION
   * ============================
   */

  async function handleVerification(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isVerifying) {
      return;
    }

    await verifyCode(
      otp.join("")
    );
  }

  /*
   * ============================
   * SEND EMAIL OTP
   * ============================
   */

  async function handleSendEmailOtp() {
    if (!userEmail) {
      setError(
        "Email login tidak ditemukan. Silakan login kembali."
      );

      return;
    }

    if (
      emailResendSeconds >
        0 ||
      isSendingEmailOtp
    ) {
      return;
    }

    const apiUrl =
      process.env
        .NEXT_PUBLIC_API_URL ??
      "http://localhost:4000";

    setError("");
    setSuccessMessage("");

    setIsSendingEmailOtp(
      true
    );

    try {
      const apiBase =
        `${apiUrl.replace(
          /\/$/,
          ""
        )}/auth`;

      const response =
        await fetch(
          `${apiBase}/request-otp`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email:
                  userEmail,
              }),
          }
        );

      let data:
        VerifyResponse = {};

      try {
        data =
          (await response.json()) as VerifyResponse;
      } catch {
        data = {};
      }

      if (
        !response.ok ||
        !data.success
      ) {
        if (
          response.status ===
          429
        ) {
          const cooldownUntil =
            Date.now() +
            EMAIL_RESEND_COOLDOWN *
              1000;

          setEmailResendSeconds(
            EMAIL_RESEND_COOLDOWN
          );

          sessionStorage.setItem(
            "emailOtpCooldownUntil",
            String(
              cooldownUntil
            )
          );
        }

        throw new Error(
          data.message ??
            (response.status ===
            429
              ? "Terlalu banyak permintaan OTP. Tunggu 1 menit lalu coba kembali."
              : "Kode OTP gagal dikirim melalui email.")
        );
      }

      setVerificationMethod(
        "email"
      );

      setEmailOtpSent(
        true
      );

      setEmailResendSeconds(
        EMAIL_RESEND_COOLDOWN
      );

      sessionStorage.setItem(
        "emailOtpCooldownUntil",
        String(
          Date.now() +
            EMAIL_RESEND_COOLDOWN *
              1000
        )
      );

      setOtp(
        Array(
          OTP_LENGTH
        ).fill("")
      );

      setSuccessMessage(
        data.message ??
          "Kode OTP telah dikirim ke email yang terdaftar."
      );

      window.setTimeout(
        () => {
          inputRefs.current[
            0
          ]?.focus();
        },
        0
      );
    } catch (
      sendError
    ) {
      setError(
        sendError instanceof
        Error
          ? sendError.message
          : "Terjadi kesalahan saat mengirim kode OTP."
      );
    } finally {
      setIsSendingEmailOtp(
        false
      );
    }
  }

  /*
   * ============================
   * CLEAR SESSION
   * ============================
   */

  function clearVerificationSession() {
    sessionStorage.removeItem(
      "twoFactorUserId"
    );

    sessionStorage.removeItem(
      "twoFactorEmail"
    );

    sessionStorage.removeItem(
      "twoFactorNeedsSetup"
    );

    sessionStorage.removeItem(
      "twoFactorQrCode"
    );
  }

  /*
   * ============================
   * BACK TO LOGIN
   * ============================
   */

  function handleBackToLogin() {
    clearVerificationSession();

    router.replace(
      `/${locale}/login`
    );
  }

  /*
   * ============================
   * OTP STATUS
   * ============================
   */

  const isOtpComplete =
    otp.every(
      (digit) =>
        /^\d$/.test(digit)
    );

  return {
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
  };
}