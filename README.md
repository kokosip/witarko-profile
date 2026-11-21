# Witarko | CV & Portfolio

Website CV dan portofolio single-page untuk **Witarko**, dibangun menggunakan **Laravel 13**, **Inertia.js (React)**, **Tailwind CSS**, dan **PostgreSQL**.

## Tentang Witarko

**Witarko** (`@kokosip`) adalah seorang pengembang perangkat lunak yang berbasis di **Yogyakarta, Indonesia**. Ia mengerjakan berbagai proyek lintas platform, mulai dari backend dan aplikasi web berbasis Laravel/PHP dan JavaScript, skrip pengolahan data dengan Python, hingga aplikasi mobile Android dan Android TV menggunakan Kotlin serta Flutter/Dart.

- GitHub: [https://github.com/kokosip](https://github.com/kokosip)
- LinkedIn: [https://www.linkedin.com/in/kokosip/](https://www.linkedin.com/in/kokosip/)

## Fitur Utama

- **Halaman CV Publik (`/`)**: Tampilan single-page tanpa login yang memuat ringkasan profil, riwayat pengalaman, daftar proyek beserta URL subdomain deploy dan tautan GitHub, keahlian teknis, pendidikan, mode terang/gelap, serta fitur cetak PDF.
- **Halaman Admin (`/admin`)**: Antarmuka pengelolaan untuk memperbarui profil, menambah atau mengubah riwayat pengalaman, pendidikan, keahlian, serta mengelola daftar proyek dan URL subdomainnya.

## Instalasi Singkat

1. **Siapkan dependensi PHP dan Node.js**
   ```bash
   composer install
   npm install
   ```

2. **Konfigurasi Environment & PostgreSQL**
   Salin `.env.example` menjadi `.env` (jika belum ada), lalu sesuaikan kredensial PostgreSQL:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=witarko_profile
   DB_USERNAME=postgres
   DB_PASSWORD=password_anda
   ```
   Pastikan database `witarko_profile` sudah dibuat di PostgreSQL.

3. **Generate key, migrasi, dan seeder**
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```

4. **Build aset frontend & jalankan server**
   ```bash
   npm run build
   php artisan serve
   ```
   Akses halaman CV di `http://127.0.0.1:8000` dan halaman admin di `http://127.0.0.1:8000/admin`.

## Pengujian

```bash
php artisan test
```
