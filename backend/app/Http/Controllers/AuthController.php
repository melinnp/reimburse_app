<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login (Request $request) 
    {
        $credentials = $request->only('email', 'password');

        if(!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'users' => auth()->user(),
        ]);
    }
}
