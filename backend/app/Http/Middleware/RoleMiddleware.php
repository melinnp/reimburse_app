<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // 1. Cek Login
        if (!auth('api')->check()) {
            // JANGAN redirect, tapi return JSON error
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = auth('api')->user();

        // 2. Cek Role
        // Pastikan nama kolom di database kamu beneran 'role'
        if ($user->role !== $role) {
            return response()->json([
                'message' => 'Forbidden. Role anda tidak sesuai.',
            ], 403);
        }

        return $next($request);
    }
}
