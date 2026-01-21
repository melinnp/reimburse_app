<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmployeeReimburseController;

Route::post('/login', [AuthController::class, 'login']);

// Dibungkus middleware krn harus memakai token, berbeda dgn login krn generate token (token blm ada)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/admin/reimburse', [AdminController::class, 'index']); // Untuk ambil seluruh data pengajuan yg ada
    Route::get('/admin/employee', [AdminController::class, 'users']); // Untuk mengambil seluruh data karyawan yg sudah terdaftar
    Route::get('/admin/reimburse/{id}', [AdminController::class, 'show']); // Untuk melihat detail dri sebuah pengajuan
    Route::post('/admin/reimburse/{id}/approve', [AdminController::class, 'approve']); // Untuk melakukan approve terhadap sebuah pengajuan
    Route::post('/admin/reimburse/{id}/reject', [AdminController::class, 'reject']); // Untuk melakukan reject terhadap sebuah pengajuan
});

Route::middleware('auth:api', 'role:karyawan')->group(function () {
    Route::get('/employee/reimburse', [EmployeeReimburseController::class, 'index']); // Untuk mengambil data data riwayat pengajuan yg sudah dibuat user
    Route::get('/employee/me', [EmployeeReimburseController::class, 'me']); // Untuk melihat data user yg sudah dilogin
    Route::get('/employee/reimburse/{$id}', [EmployeeReimburseController::class, 'show']); // Untuk melihat detail dri sebuah pengajuan yg sudah dibuat
    Route::post('/employee/reimburse/create', [EmployeeReimburseController::class, 'create']); // Untuk membuat sebuah form pengajuan
    Route::delete('/employee/reimburse/{id}/delete', [EmployeeReimburseController::class, 'delete']); // Untuk menghapus sebuah pengajuan
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