"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
exports.sendLeadNotificationEmail = sendLeadNotificationEmail;
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const LOGO_URL = `${process.env.APP_URL || 'http://localhost:3000'}/images/icon-logo.png`;
const BRAND = {
    name: 'Permana Solutions',
    primaryColor: '#0e5a7a',
    accentColor: '#1cb5b0',
    textColor: '#1a2733',
    mutedColor: '#6b7a86',
    borderColor: '#e6eaed',
    address: 'Jl. Cideng Barat No.21B, RT.11/RW.11, Duri Pulo, Kecamatan Gambir, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10140',
    instagram: 'https://www.instagram.com/permana.solutions?igsh=ajh6aDdtenNvaWM0',
    youtube: 'https://www.youtube.com/@permanasolutions',
};
const FONT_STACK = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
function baseEmailTemplate(eyebrow, heading, contentHtml, bgColor = '#eef1f3') {
    const year = new Date().getFullYear();
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  </head>
  <body style="margin:0; padding:0; background:${bgColor}; font-family:${FONT_STACK};">
    <div style="background:${bgColor}; padding:40px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(16,24,32,0.08);">

              <!-- ACCENT BAR -->
              <tr>
                <td style="background:${BRAND.accentColor}; height:4px; line-height:4px; font-size:0;">&nbsp;</td>
              </tr>

              <!-- HEADER with Logo + Brand Name Side by Side -->
              <tr>
                <td style="background:${BRAND.primaryColor}; padding:24px 32px;" align="left">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="vertical-align:middle; padding-right:10px;">
                        <img 
                          src="${LOGO_URL}" 
                          alt="${BRAND.name}" 
                          height="32" 
                          style="display:block; border-radius:4px;" 
                        />
                      </td>
                      <td style="
                        vertical-align:middle;
                        font-size:18px;
                        font-weight:700;
                        color:#ffffff;
                        letter-spacing:0.5px;
                        white-space:nowrap;
                      ">
                        ${BRAND.name}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CONTENT -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="margin:0 0 8px; font-size:11px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; color:${BRAND.accentColor};">
                    ${eyebrow}
                  </p>
                  <h1 style="margin:0 0 24px; font-size:21px; line-height:1.35; font-weight:700; color:${BRAND.textColor};">
                    ${heading}
                  </h1>
                  ${contentHtml}
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background:#f6f8f9; padding:28px 40px; border-top:1px solid ${BRAND.borderColor};">
                  <p style="margin:0 0 6px; font-size:13px; font-weight:700; color:${BRAND.textColor};">${BRAND.name}</p>
                  <p style="margin:0 0 14px; font-size:12px; line-height:1.6; color:${BRAND.mutedColor};">${BRAND.address}</p>
                  <p style="margin:0; font-size:12px; color:${BRAND.mutedColor};">
                    <a href="${BRAND.instagram}" style="color:${BRAND.mutedColor}; text-decoration:none;">Instagram</a>
                    <span style="color:${BRAND.borderColor};">&nbsp;&middot;&nbsp;</span>
                    <a href="${BRAND.youtube}" style="color:${BRAND.mutedColor}; text-decoration:none;">YouTube</a>
                    <span style="color:${BRAND.borderColor};">&nbsp;&middot;&nbsp;</span>
                    <span>&copy; ${year}</span>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>
  `;
}
function detailRow(label, value, isLast = false) {
    return `
    <tr>
      <td style="padding:12px 0; ${isLast ? '' : `border-bottom:1px solid ${BRAND.borderColor};`} font-size:13px; color:${BRAND.mutedColor}; width:150px; vertical-align:top;">
        ${label}
      </td>
      <td style="padding:12px 0; ${isLast ? '' : `border-bottom:1px solid ${BRAND.borderColor};`} font-size:14px; color:${BRAND.textColor}; font-weight:600; vertical-align:top;">
        ${value}
      </td>
    </tr>
  `;
}
function ctaButton(href, label) {
    return `
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:6px; background:${BRAND.accentColor};">
          <a href="${href}" style="display:inline-block; padding:12px 28px; font-size:13px; font-weight:700; letter-spacing:0.3px; color:#ffffff; text-decoration:none;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
}
async function sendOtpEmail(to, code) {
    const content = `
    <p style="margin:0 0 20px; font-size:14px; line-height:1.6; color:${BRAND.mutedColor};">
      Gunakan kode berikut untuk menyelesaikan proses login Anda. Kode ini berlaku selama 5 menit.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px; background:#f6f8f9; border:1px solid ${BRAND.borderColor}; border-radius:8px;">
      <tr>
        <td style="padding:18px 32px;">
          <span style="font-size:28px; font-weight:700; letter-spacing:8px; color:${BRAND.textColor};">${code}</span>
        </td>
      </tr>
    </table>
    <p style="margin:0; font-size:13px; line-height:1.6; color:${BRAND.mutedColor};">
      Jika Anda tidak meminta kode ini, abaikan email ini — akun Anda tetap aman.
    </p>
  `;
    await transporter.sendMail({
        from: `"${BRAND.name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject: 'Kode verifikasi login Anda',
        html: baseEmailTemplate('Verifikasi Login', 'Kode OTP Anda', content, '#ffffff'),
    });
}
async function sendLeadNotificationEmail(data) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@permana.com';
    const content = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${detailRow('Nama Lengkap', data.full_name)}
      ${detailRow('Perusahaan', data.company)}
      ${detailRow('Telepon / WA', data.phone)}
      ${detailRow('Email', `<a href="mailto:${data.email}" style="color:${BRAND.primaryColor}; text-decoration:none;">${data.email}</a>`, true)}
    </table>

    <p style="margin:0 0 8px; font-size:11px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:${BRAND.mutedColor};">
      Deskripsi Kebutuhan
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px; background:#f6f8f9; border-left:3px solid ${BRAND.accentColor}; border-radius:0 6px 6px 0;">
      <tr>
        <td style="padding:16px 18px; font-size:14px; line-height:1.6; color:${BRAND.textColor};">
          ${data.message}
        </td>
      </tr>
    </table>

    ${ctaButton(`${process.env.APP_URL}/admin/leads`, 'Lihat di Dashboard')}

    <p style="margin:28px 0 0; font-size:12px; color:${BRAND.mutedColor};">
      Notifikasi ini dikirim otomatis oleh sistem ${BRAND.name}.
    </p>
  `;
    await transporter.sendMail({
        from: `"${BRAND.name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `Lead baru dari ${data.full_name}`,
        html: baseEmailTemplate('Lead Baru', 'Ada permintaan baru dari website', content),
    });
}
async function sendResetPasswordEmail(to, resetLink) {
    const content = `
    <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:${BRAND.mutedColor};">
      Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk melanjutkan — tautan ini berlaku selama 15 menit.
    </p>
    <div style="margin:0 0 24px;">
      ${ctaButton(resetLink, 'Reset Password')}
    </div>
    <p style="margin:0; font-size:13px; line-height:1.6; color:${BRAND.mutedColor};">
      Jika Anda tidak meminta reset password, abaikan email ini dan password Anda akan tetap sama.
    </p>
  `;
    await transporter.sendMail({
        from: `"${BRAND.name}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject: 'Reset password akun Anda',
        html: baseEmailTemplate('Keamanan Akun', 'Reset password Anda', content),
    });
}
