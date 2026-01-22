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

Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::get('/admin/reimburse', [AdminController::class, 'index']);
    Route::post('/admin/reimburse/{id}/approve', [AdminController::class, 'approve']);
    Route::post('/admin/reimburse/{id}/reject', [AdminController::class, 'reject']);
});

Route::middleware('auth:api', 'role:karyawan')->group(function () {
    Route::get('/employee/reimburse', [EmployeeReimburseController::class, 'index']);
    Route::post('/employee/reimburse', [EmployeeReimburseController::class, 'create']);
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