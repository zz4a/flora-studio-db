# FloraStudio — Garden & Plantation Monitoring

FloraStudio adalah aplikasi pemantauan kebun berbasis Next.js 14. Tampilan asli, rute halaman, grafik, formulir, tema, gambar, dan komponen visual dipertahankan. Backend menggunakan Next.js Route Handlers, MariaDB/MySQL, autentikasi berbasis sesi, dan kata sandi yang di-hash.

## Stack

- Next.js 14 App Router dan TypeScript
- MariaDB / MySQL melalui `mysql2`
- Autentikasi akun dengan `bcryptjs` serta cookie sesi `HttpOnly`
- API server untuk login/logout, pengambilan data, CRUD lahan, CRUD catatan, dan reset dataset
- Tailwind CSS, Framer Motion, lucide-react, Recharts, dan next-themes

## Persyaratan

- Node.js 18.17 atau lebih baru
- npm
- MariaDB atau MySQL berjalan secara lokal atau di server yang dapat diakses aplikasi

## Instalasi lokal

1. Ekstrak ZIP proyek.
2. Buat database dengan phpMyAdmin: pilih tab **Import**, lalu impor `database/schema.sql`. Skrip membuat database `florastudio` dan tabel yang diperlukan. Jika database memakai nama berbeda, ubah `DB_NAME` di `.env.local` sesuai nama tersebut.
3. Salin `.env.example` menjadi `.env.local`.
4. Isi koneksi database (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). Ganti `SESSION_SECRET` dengan string rahasia acak minimal 32 karakter. Atur `ADMIN_PASSWORD` dan `USER_PASSWORD` sebelum aplikasi pertama kali dijalankan.
5. Instal dependensi dan jalankan:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Saat API pertama kali diakses, backend akan membuat tabel yang belum ada, membuat dua akun awal jika tabel `users` masih kosong, serta mengisi delapan lahan dan catatan contoh satu kali. Dataset contoh bersifat simulasi, bukan pembacaan sensor nyata.

Verifikasi build:

```bash
npm run lint
npm run build
npm start
```

## Akun awal

Nilai bawaan untuk pengembangan lokal:

| Peran | Email | Kata sandi awal |
|---|---|---|
| Admin | `admin@florastudio.id` | `admin123` |
| User Biasa | `user@florastudio.id` | `user123` |

**Ganti kata sandi bawaan sebelum dipakai di lingkungan publik atau produksi.** Akun awal hanya dibuat ketika tabel `users` kosong. Mengubah `.env.local` setelah akun pernah dibuat tidak akan mengganti hash kata sandi di database secara otomatis; ubah akun tersebut di database atau buat mekanisme reset kata sandi sebelum deploy.

## Hak akses

- **User Biasa:** masuk, melihat dashboard dan lahan, serta menambah, mengubah, dan menghapus catatan observasi.
- **Admin:** semua kemampuan User Biasa, serta menambah, mengubah, dan menghapus lahan dan memulihkan dataset contoh.
- Peran dibaca dari baris akun database yang diverifikasi server. Nilai peran di browser tidak dianggap sebagai sumber otoritas.
- Sesi disimpan dalam cookie `HttpOnly`, `SameSite=Lax`, dengan masa berlaku tujuh hari.

## API backend

| Metode | Endpoint | Fungsi | Hak akses |
|---|---|---|---|
| `POST` | `/api/auth/login` | Verifikasi email/kata sandi dan membuat sesi | Publik |
| `POST` | `/api/auth/logout` | Menghapus sesi | Publik |
| `GET` | `/api/state` | Mengambil pengguna aktif, lahan, catatan, dan aktivitas | Login |
| `POST` | `/api/plots` | Membuat lahan | Admin |
| `PATCH` | `/api/plots/:id` | Memperbarui lahan | Admin |
| `DELETE` | `/api/plots/:id` | Menghapus lahan dan catatan terkait | Admin |
| `POST` | `/api/observations` | Membuat catatan observasi | Login |
| `PATCH` | `/api/observations/:id` | Memperbarui catatan | Login |
| `DELETE` | `/api/observations/:id` | Menghapus catatan | Login |
| `POST` | `/api/reset` | Memulihkan delapan lahan dan catatan seed | Admin |

Perubahan CRUD dikirim dari komponen frontend ke API lalu disimpan di database. Data lahan, observasi, dan aktivitas dibagikan antar-sesi yang masuk ke database yang sama. Catatan observasi juga memperbarui ringkasan kesehatan, kondisi lingkungan, dan riwayat pertumbuhan pada lahan terkait.

## Skema penyimpanan

`database/schema.sql` membuat tabel `users`, `plots`, `observations`, `activities`, serta `app_meta`. Data akun disimpan terpisah dengan hash kata sandi. Payload lahan dan observasi disimpan sebagai JSON tekstual di kolom `LONGTEXT` agar struktur detail yang telah digunakan antarkomponen tetap terpelihara. Relasi foreign key menghapus catatan terkait ketika suatu lahan dihapus.

## Catatan operasional

- Simpan `.env.local` di luar version control; jangan bagikan rahasia sesi atau kata sandi produksi.
- Pastikan user MariaDB memiliki izin untuk membuat dan mengubah tabel pada database aplikasi. Aplikasi mencoba membuat tabel otomatis pada inisialisasi, tetapi database itu sendiri harus sudah dibuat.
- Untuk deployment, gunakan HTTPS agar cookie sesi dikirim dengan atribut `Secure`, ganti kredensial bawaan, dan tentukan `SESSION_SECRET` yang kuat.
- Seed awal hanya dimasukkan sekali. Menghapus seluruh lahan secara sengaja tidak akan memicu pemasukan ulang seed secara otomatis. Tombol **Reset demo** menggunakan endpoint admin untuk memulihkan seed awal.
- Lokasi, suhu, kelembapan, curah hujan, dan pertumbuhan pada data contoh adalah simulasi. Peta ilustratif dan gambar Unsplash bukan validasi lokasi lahan.
