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

        // --- DEBUGGING AREA (Hapus nanti kalau udah fix) ---
        // Ini cara buat ngetes ID dan Role kebaca atau ngga
        // dd([
        //    'id_user' => $user->id,
        //    'role_di_database' => $user->role,
        //    'role_yang_diminta_route' => $role,
        //    'apakah_sama' => $user->role === $role
        // ]);
        // --------------------------------------------------

        // 2. Cek Role
        // Pastikan nama kolom di database kamu beneran 'role'
        if ($user->role !== $role) {
            // Ubah abort(403) jadi JSON biar rapi di Postman
            return response()->json([
                'message' => 'Forbidden. Role anda tidak sesuai.',
                'user_role' => $user->role, // Biar tau dia kedeteksinya sbg apa
                'required_role' => $role
            ], 403);
        }

        return $next($request);
    }
}
