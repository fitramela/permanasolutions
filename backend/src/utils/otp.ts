export function generateOtp(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export function isOtpExpired(createdAt: Date, expiryMinutes: number = 5): boolean {
  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes > expiryMinutes;
}