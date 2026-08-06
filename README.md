
# Permana

Proyek monorepo yang berisi:
- **Frontend**: Next.js 16 (App Router) dengan i18n (`next-intl`)
- **Backend**: Express + Prisma + TypeScript (folder `backend`)

Keduanya dapat dijalankan bersamaan dengan skrip yang telah disediakan.

**Prasyarat**
- Node.js 18+
- npm

**Instalasi**
1. Clone repositori.
2. Install dependensi root dan backend:

```bash
npm install
cd backend && npm install
```

Atau dari root cukup jalankan `npm install` lalu `cd backend && npm install` jika diperlukan.

**Skrip penting**
- `npm run dev` — jalankan frontend (Next.js) pada `http://localhost:3000`
- `cd backend && npm run dev` — jalankan backend (Express) pada `http://localhost:4000` (default)
- `npm run dev:all` — jalankan frontend + backend bersamaan (menggunakan `concurrently`)

Contoh menjalankan semuanya dari root:

```bash
npm run dev:all
```

Jika terjadi error saat `npm run dev:all`, pastikan kamu menjalankan perintah dari folder root proyek dan sudah menginstal dependensi di `backend/`.

## Backend API (ringkasan)

Beberapa endpoint yang tersedia di backend:
- `GET /api/health` — cek status layanan
- `POST /api/login` — autentikasi dan kembalikan JWT
- `GET /api/users` — daftar pengguna
- `GET /api/users/:id` — detail pengguna
- `POST /api/users` — buat pengguna
- `PUT /api/users/:id` — update pengguna
- `DELETE /api/users/:id` — hapus pengguna

Contoh `curl` singkat:

```bash
curl http://localhost:4000/api/users
```

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Fathi","email":"fathirafifm@gmail.com","password":"secret123"}'
```

## Environment

Environment variables backend ditempatkan di `backend/.env` (contoh):
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `CORS_ORIGIN`

Jangan commit file `.env`. Jika perlu, tambahkan `backend/.env.example` berisi contoh variabel.

## Prisma

Jika perlu meng-generate Prisma Client secara manual:

```bash
cd backend && npm run generate
```

Untuk men-seed database (jika ada):

```bash
cd backend && npm run prisma:seed
```

## .gitignore

Repository sudah memiliki `.gitignore` di root dan di `backend/`. Secara umum sudah benar, namun ada beberapa catatan kecil pada pengaturan monorepo (lihat bagian pemeriksaan `.gitignore` di bawah).

## Kontak
Jika ada pertanyaan, buka issue atau hubungi pemilik repo.


