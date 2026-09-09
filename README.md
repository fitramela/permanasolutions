
# Permana Solutions

Repositori monorepo untuk website profil perusahaan dan sistem manajemen konten (CMS) **Permana Solution**.

Arsitektur proyek terdiri dari:
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS + `next-intl` (dukungan multibahasa: Indonesia & Inggris)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM (MySQL/MariaDB) + Redis + Swagger UI (folder `backend`)

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Struktur Direktori](#struktur-direktori)
- [Prasyarat Sistem](#prasyarat-sistem)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Prisma & Database Setup](#prisma--database-setup)
- [Daftar Endpoint Backend](#daftar-endpoint-backend)
- [Dokumentasi API (Swagger)](#dokumentasi-api-swagger)
- [Kontribusi & Lisensi](#kontribusi--lisensi)

---

## Fitur Utama

- **Company Profile**: Halaman Beranda, Tentang Kami, Solusi, Layanan (ASP, ISP, Resource), Kontak, dan Klien.
- **Multibahasa (i18n)**: Dukungan penuh Bahasa Indonesia (`/id`) dan Bahasa Inggris (`/en`) dengan `next-intl`.
- **CMS & Admin Panel**: Dasbor admin untuk mengelola konten halaman, klien, produk, tim, teknologi, pesan (leads), dan SEO.
- **Keamanan & Autentikasi**:
  - Otentikasi berbasis JWT & Refresh Token
  - Verifikasi Email & OTP
  - Two-Factor Authentication (2FA / TOTP)
  - Rate limiting (Express Rate Limit & Redis)
  - HTTP header protection (Helmet & HPP)
- **Manajemen Media**: Upload gambar via penyimpanan lokal atau Cloudinary.
- **Tracking & Analytics**: Pelacakan analitik kunjungan dan konversi.

---

## Struktur Direktori

```text
permana/
├── app/                              # Frontend Next.js (App Router)
│   ├── [locale]/                     # Halaman terlokalisasi (en/id)
│   │   ├── (admin)/admin/            # Panel Admin & CMS
│   │   ├── (auth)/                   # Login, Register, OTP, Reset Password
│   │   └── (website)/                # Halaman publik (Home, About, Services, etc.)
│   ├── components/                   # Komponen UI (Navbar, Footer, Section, Admin UI)
│   ├── hooks/                        # React hooks untuk admin & tracking
│   ├── services/                     # Layanan fetch CMS & API client
│   └── globals.css                   # Global styles Tailwind CSS
├── backend/                          # Backend Express + Prisma
│   ├── prisma/                       # Skema Prisma, migrasi, dan seeder
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── bootstrap/                # Inisialisasi data default CMS
│       ├── docs/                     # Konfigurasi Swagger OpenAPI
│       ├── middlewares/              # Auth, error handling, validasi, rate limit
│       ├── repositories/             # Akses database Prisma
│       ├── routes/                   # Definisi route API
│       ├── services/                 # Logika bisnis
│       ├── utils/                    # JWT, Redis, OTP, email helper
│       ├── validators/               # Validasi skema request (Zod)
│       ├── app.ts                    # Inisialisasi Express app
│       └── index.ts                  # Entry point server backend
├── messages/                         # Terjemahan i18n
│   ├── en.json
│   └── id.json
├── public/                           # Aset statis & gambar
├── package.json                      # Root package.json (monorepo workspaces)
└── README.md
```

---

## Prasyarat Sistem

- **Node.js**: Versi 18.x atau lebih tinggi (disarankan Node.js 20+)
- **npm**: Versi 9.x atau lebih tinggi
- **Database**: MySQL atau MariaDB
- **Redis** *(opsional untuk development, disarankan untuk caching dan rate limiting)*

---

## Instalasi

Repository ini dikonfigurasi menggunakan npm workspaces. Anda dapat menginstal seluruh dependensi (root & backend) langsung dari root direktori:

```bash
# Clone repositori
git clone https://github.com/Temlearnt/permana.git
cd permana

# Install dependensi untuk root dan backend workspace
npm install
```

Atau jika ingin menginstal dependensi backend secara terpisah:

```bash
cd backend
npm install
cd ..
```

---

## Konfigurasi Environment

### 1. Environment Frontend (`.env.local` pada folder root)

Buat file `.env.local` di folder root:

```env
# URL dasar endpoint backend API
NEXT_PUBLIC_API_URL=http://localhost:4000/api/backend
```

### 2. Environment Backend (`backend/.env`)

Buat file `.env` di dalam folder `backend/`:

```env
# Server
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# Database (MySQL / MariaDB)
DATABASE_URL="mysql://username:password@localhost:3306/permana_db"

# Keamanan JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_here
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS (pisahkan dengan koma jika lebih dari satu)
CORS_ORIGIN=http://localhost:3000

# Redis (Opsional / Default: localhost:6379)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Media Storage (Pilihan: 'local' atau 'cloudinary')
STORAGE_PROVIDER=local
UPLOAD_DIR=storage/images

# Cloudinary (Wajib jika STORAGE_PROVIDER=cloudinary)
# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=

# Email / SMTP (untuk pengiriman OTP & reset password)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
# EMAIL_FROM="Permana Solution <noreply@permana.com>"
```

---

## Menjalankan Aplikasi

Tersedia beberapa skrip npm dari root folder untuk mempermudah alur kerja:

| Perintah | Keterangan |
| :--- | :--- |
| `npm run dev:all` | **Menjalankan Frontend & Backend sekaligus** secara bersamaan via `concurrently` |
| `npm run dev` | Menjalankan server frontend Next.js pada `http://localhost:3000` |
| `npm run dev:backend` | Menjalankan server backend Express pada `http://localhost:4000` |
| `npm run build` | Melakukan compile dan build produksi frontend Next.js |
| `npm run start` | Menjalankan build produksi frontend Next.js |
| `npm run lint` | Menjalankan linter ESLint |

### Contoh Menjalankan Secara Bersamaan:

```bash
npm run dev:all
```

Akses layanan:
- **Frontend Website**: `http://localhost:3000`
- **Panel Admin CMS**: `http://localhost:3000/id/admin` atau `http://localhost:3000/en/admin`
- **Backend API**: `http://localhost:4000/api/backend`
- **Dokumentasi Swagger**: `http://localhost:4000/api/backend/docs`

---

## Prisma & Database Setup

Masuk ke folder `backend/` untuk menjalankan perintah manajemen database:

```bash
cd backend

# 1. Generate Prisma Client
npm run generate

# 2. Jalankan migrasi database
npx prisma migrate dev --name init

# 3. Seed data awal (akun admin & template konten CMS)
npx prisma db seed
```

*(Catatan: Saat backend dijalankan pertama kali, fungsi `ensureInitialCmsData()` juga akan otomatis memastikan template data konten CMS terisi ke database).*

---

## Daftar Endpoint Backend

Seluruh endpoint backend berada di bawah prefix `/api/backend`:

### 1. Health Check
- `GET /api/backend/health` — Cek status server backend

### 2. Autentikasi (`/api/backend/auth`)
- `POST /api/backend/auth/login` — Login pengguna dan mendapatkan token JWT
- `POST /api/backend/auth/request-otp` — Meminta kode OTP verifikasi
- `POST /api/backend/auth/verify-otp` — Verifikasi kode OTP
- `POST /api/backend/auth/resend-otp` — Kirim ulang kode OTP
- `POST /api/backend/auth/forgot-password` — Pengajuan reset password melalui email
- `POST /api/backend/auth/reset-password` — Konfirmasi reset password baru
- `POST /api/backend/auth/2fa/setup` — Setup autentikasi 2 faktor (QR Code)
- `POST /api/backend/auth/2fa/verify` — Verifikasi aktivasi 2FA

### 3. Pengguna (`/api/backend/users`)
- `GET /api/backend/users` — Daftar seluruh user (perlu autentikasi)
- `GET /api/backend/users/:id` — Detail user berdasarkan ID
- `POST /api/backend/users` — Membuat user baru
- `PUT /api/backend/users/:id` — Memperbarui data user
- `DELETE /api/backend/users/:id` — Menghapus user

### 4. CMS (`/api/backend/cms`)
- `GET /api/backend/cms/pages/:slug` — Mengambil data konten halaman berdasarkan slug & locale (contoh: `home`, `about`, `solutions`, `contact`)
- `PUT /api/backend/cms/pages/:slug` — Memperbarui konten halaman
- `GET /api/backend/cms/clients` — Daftar logo & nama klien
- `GET /api/backend/cms/technologies` — Daftar teknologi pendukung
- `GET /api/backend/cms/products` — Daftar portofolio & produk solusi
- `GET /api/backend/cms/team` — Daftar anggota tim

### 5. Leads & Kontak (`/api/backend/leads`)
- `POST /api/backend/leads` — Mengirim formulir pesan kontak dari website
- `GET /api/backend/leads` — Mengambil daftar pesan masuk di panel admin

### 6. Media & Upload (`/api/backend/upload`)
- `POST /api/backend/upload/image` — Upload gambar ke storage lokal atau Cloudinary

### 7. Dashboard & Analytics
- `GET /api/backend/dashboard` — Data ringkasan statistik untuk dashboard admin
- `POST /api/backend/track` — Merekam analitik kunjungan pengunjung

## Troubleshooting

1. **Error koneksi database**:
   - Pastikan service MySQL/MariaDB menyala.
   - Periksa kembali konfigurasi `DATABASE_URL` di `backend/.env`.
2. **Error port sudah terpakai (EADDRINUSE)**:
   - Port 3000 untuk frontend dan 4000 untuk backend. Jika port 4000 digunakan proses lain, Anda dapat mengubah `PORT` di `backend/.env` dan memperbarui `NEXT_PUBLIC_API_URL` di frontend.
3. **Prisma Client belum ter-generate**:
   - Jalankan `cd backend && npm run generate`.

---

## Lisensi & Kontak

Proyek ini dikembangkan untuk **Permana Solution**. Untuk pertanyaan, kendala teknis, atau permintaan fitur, silakan buat issue baru atau hubungi tim pengembang repositori.
