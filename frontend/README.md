# Reimburse App Frontend - SPA

Aplikasi frontend untuk sistem reimbursement yang menggunakan konsep Single Page Application (SPA) dengan Bootstrap yang diinstall via npm.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Build untuk Production

```bash
npm run build
```

File hasil build akan berada di folder `dist/`

## Preview Production Build

```bash
npm run preview
```

## Struktur Aplikasi

- `public/index.html` - Entry point SPA
- `public/Script/main.js` - Main application entry
- `public/Script/router.js` - Client-side router
- `public/Script/viewLoader.js` - View loader untuk memuat halaman
- `public/Script/layoutManager.js` - Manager untuk layout (sidebar, navbar)
- `public/views/` - Template HTML untuk setiap halaman

## Routing

Aplikasi menggunakan hash-based routing:
- `/login` - Halaman login
- `/user/dashboard` - Dashboard user/karyawan
- `/user/history` - Riwayat pengajuan user
- `/user/submission` - Form pengajuan user
- `/user/account` - Akun user
- `/admin/dashboard` - Dashboard admin
- `/admin/employees` - Daftar karyawan
- `/admin/approval` - Approval pengajuan
- `/admin/account` - Akun admin

## Dependencies

- **Bootstrap 5.3.3** - Framework CSS (via npm)
- **Bootstrap Icons 1.11.3** - Icon library (via npm)
- **Vite 6.0.11** - Build tool dan dev server

## Catatan

- Pastikan backend API berjalan di `http://localhost:8000`
- Semua navigasi menggunakan hash routing (`#/route`)
- Aplikasi menggunakan ES modules untuk JavaScript

