<?php

use Illuminate\Support\Facades\Route;
<<<<<<< HEAD
=======

Route::post('/login', [AuthController::class, 'login']);

// Dummy route dgn implementasi middleware
// Route::middleware(['auth', 'role:admin'])->group(function () {
//     Route::get('/admin/dashboard', function () {
//         return 'Dashboard Admin';
//     });
// });

// Route::middleware(['auth', 'role:karyawan'])->group(function () {
//     Route::get('/karyawan/dashboard', function () {
//         return 'Dashboard Karyawan';
//     });
// });
>>>>>>> f8e34fdddeefe4add1e88eaee60fdd412e7ce788
