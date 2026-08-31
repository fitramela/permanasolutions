declare module 'speakeasy' {
  export interface Secret {
    ascii: string;
    hex: string;
    base32: string;
    base64: string;
    otpauth_url?: string;
  }

  export interface GenerateSecretOptions {
    length?: number;
    name?: string;
    issuer?: string;
    algorithm?: 'sha1' | 'sha256' | 'sha512';
    digits?: number;
    period?: number;
    counter?: number;
    secret?: string;
    encoding?: 'ascii' | 'hex' | 'base32' | 'base64';
    qr_codes?: boolean;
    google_auth_qr?: boolean;
    otpauth_url?: boolean;
    symbols?: boolean;
  }

  export interface TotpOptions {
    secret: string;
    encoding?: 'ascii' | 'hex' | 'base32' | 'base64';
    token?: string;
    window?: number;
    step?: number;
    epoch?: number;
    digits?: number;
    algorithm?: 'sha1' | 'sha256' | 'sha512';
    time?: number;
  }

  export interface OtpauthURLOptions {
    secret: string;
    label: string;
    issuer?: string;
    encoding?: 'ascii' | 'hex' | 'base32' | 'base64';
    algorithm?: 'sha1' | 'sha256' | 'sha512';
    digits?: number;
    period?: number;
    counter?: number;
  }

  // TOTP adalah function yang juga memiliki method verify
  export interface TotpFunction {
    (options: TotpOptions): string;
    verify(options: TotpOptions): { delta: number } | null;
    verifyDelta(options: TotpOptions): { delta: number } | null;
  }

  export function generateSecret(
    options?: GenerateSecretOptions
  ): Secret;

  export const totp: TotpFunction;

  export function otpauthURL(
    options: OtpauthURLOptions
  ): string;
}