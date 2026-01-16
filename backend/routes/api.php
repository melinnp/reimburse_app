<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Dibungkus middleware krn harus memakai token, berbeda dgn login krn generate token (token blm ada)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'logout']);
    Route::post('/logout', [AuthController::class, 'me']);
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