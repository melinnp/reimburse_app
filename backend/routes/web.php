<?php

use Illuminate\Support\Facades\Route;
use App\Http\controllers\AuthController;

// routes/web.php
Route::get('admin', function () {
    return view('admin.index');
});
