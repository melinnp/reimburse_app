<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'users' => auth('api')->user(),
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }

    public function me()
    {
        return response()->json([
            'user' => JWTAuth::user(),
        ]);
    }
}
