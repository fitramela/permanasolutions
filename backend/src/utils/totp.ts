// @ts-ignore
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export const generateTotpSecret = (
  email: string,
  issuer = "Permana"
): {
  base32: string;
  otpauthUrl: string;
} => {
  const secret = speakeasy.generateSecret({
    name: `${issuer} (${email})`,
    length: 20,
  });

  return {
    base32: secret.base32,
    otpauthUrl: secret.otpauth_url!,
  };
};

export const generateQrCodeDataUrl = async (
  otpauthUrl: string
): Promise<string> => {
  return QRCode.toDataURL(otpauthUrl);
};

export const verifyTotpToken = (
  secret: string,
  token: string,
  window = 2
): boolean => {
  const result = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window,
  }) as unknown;

  if (result === true) {
    return true;
  }

  if (
    typeof result === "object" &&
    result !== null
  ) {
    return true;
  }

  return false;
};

export const buildOtpAuthUrl = (
  secret: string,
  email: string,
  issuer = "Permana"
): string => {
  return speakeasy.otpauthURL({
    secret,
    label: email,
    issuer,
    encoding: "base32",
  });
};
