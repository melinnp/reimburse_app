<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'users' => Auth::user(),
        ]);
    }
}
