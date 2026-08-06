import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `"Permana Solution" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: 'Kode Verifikasi Login Anda',
    html: `
      <h3>Kode OTP Anda</h3>
      <p>Gunakan kode berikut untuk menyelesaikan login:</p>
      <h1 style="color:#1a73e8;">${code}</h1>
      <p>Kode ini berlaku selama 5 menit.</p>
      <p>Jika Anda tidak meminta login, abaikan email ini.</p>
    `,
  });
}