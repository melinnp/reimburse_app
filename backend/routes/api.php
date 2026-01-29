<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmployeeReimburseController;

Route::post('/login', [AuthController::class, 'login']);

// Dibungkus middleware krn harus memakai token/melewati middleware, berbeda dgn login krn generate token (token blm ada)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Route Admin
Route::middleware(['auth:api', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/me', [AdminController::class, 'me']); // Untuk melihat data admin yg sudah dilogin
    Route::put('/me', [AdminController::class, 'updateProfile']); // Untuk mengupdate profile admin yg sudah dilogin
    Route::get('/dashboard', [AdminController::class, 'dashboard']); // Untuk melihat dashboard admin
    Route::get('/reimburse', [AdminController::class, 'index']); // Untuk ambil seluruh data pengajuan yg ada
    Route::get('/employee', [AdminController::class, 'users']); // Untuk mengambil seluruh data karyawan yg sudah terdaftar
    Route::post('/employee/create', [AdminController::class, 'createUser']); // Untuk membuat user karyawan baru
    Route::get('/reimburse/{id}', [AdminController::class, 'show']); // Untuk melihat detail dri sebuah pengajuan
    Route::post('/reimburse/{id}/approve', [AdminController::class, 'approve']); // Untuk melakukan approve terhadap sebuah pengajuan
    Route::post('/reimburse/{id}/reject', [AdminController::class, 'reject']); // Untuk melakukan reject terhadap sebuah pengajuan
});

// Route Karyawan
Route::middleware(['auth:api', 'role:karyawan'])->prefix('employee')->group(function () {
    Route::get('/reimburse', [EmployeeReimburseController::class, 'index']); // Untuk mengambil data data riwayat pengajuan yg sudah dibuat user
    Route::get('/me', [EmployeeReimburseController::class, 'me']); // Untuk melihat data user yg sudah dilogin
    Route::put('/me', [EmployeeReimburseController::class, 'updateProfile']); // Untuk mengupdate profile user yg sudah dilogin
    Route::get('/reimburse/{id}', [EmployeeReimburseController::class, 'show']); // Untuk melihat detail dri sebuah pengajuan yg sudah dibuat
    Route::post('/reimburse/create', [EmployeeReimburseController::class, 'store']); // Untuk membuat sebuah form pengajuan
    Route::delete('/reimburse/{id}/delete', [EmployeeReimburseController::class, 'delete']); // Untuk menghapus sebuah pengajuan
    Route::post('/reimburse/{id}/update', [EmployeeReimburseController::class, 'update']); // Untuk update pengajuan
});

// Dummy route dgn implementasi middleware
// Route::middleware(['auth:api', 'role:admin'])->group(function () {
//     Route::post('/reimburse', [ReimburseController::class, 'reimburse']); // Untuk submit pengajuan
//     Route::get('/reimburse/me', [ReimburseController::class, 'myReimburse']); // Untuk melihat pengajuan yang sudah di submit
// });

// Route::middleware(['auth:api', 'role:karyawan'])->group(function () {
//     Route::post('/reimburse/{id}/rejected', [ApprovalController::class, 'approve']);
//     Route::post('/reimburse/{id}/approved', [ApprovalController::class, 'reject']);
//     Route::get('/reimburse/me', [ApprovalController::class, 'showApproval']);
// });