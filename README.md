# Reimburse App

Aplikasi reimburse sederhana untuk karyawan dan admin.
Karyawan dapat mengajukan penggantian uang, admin memverifikasi dan menyetujui pembayaran.

## Tech Stack
- Backend: Laravel 11
- Authentication: JWT (tymon/jwt-auth)
- Frontend: Javascript & Bootstrap 5
- Database: MySQL

## Fitur
- Login & autentikasi menggunakan JWT
- Role user: admin dan karyawan
- Karyawan dapat mengajukan reimburse
- Admin dapat menyetujui atau menolak reimburse
- Status reimburse: pending, paid, rejected

## Struktur Database
- users: data user dan role
- reimburse_requests: pengajuan reimburse
- reimburse_approvals: keputusan admin

## Alur Aplikasi
1. User login dan mendapatkan JWT
2. Karyawan mengajukan reimburse
3. Admin melihat daftar reimburse
4. Admin menyetujui atau menolak
5. Status reimburse diperbarui

## Cara Menjalankan Project

### Backend
1. Clone repository
2. Masuk ke folder backend
3. Install dependency
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan jwt:secret
   php artisan serve

### Kalau FE di folder terpisah, tulis:
```md
### Frontend
Frontend menggunakan JavaScript murni dan dapat dijalankan langsung melalui browser atau live server.

## Endpoint Utama
- POST /api/login
- POST /api/reimburse
- GET /api/reimburse
- POST /api/reimburse/{id}/approve

## Catatan
- Project ini dibuat dengan pendekatan minimalis
- Belum menggunakan refresh token
- Tidak menggunakan framework frontend
