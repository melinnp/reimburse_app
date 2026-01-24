<?php

namespace App\Http\Controllers;

use App\Models\ReimburseRequest;
use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index()
    {
        $data = ReimburseRequest::with('user')
            ->where('status', 'pending')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function users()
    {
        $data = Users::where('role', 'karyawan')->get();

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,karyawan',
            'password' => 'required|min:6'
        ]);

        $user = Users::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'User berhasil dibuat',
            'data' => $user
        ]);
    }

    public function show($id)
    {
        $data = ReimburseRequest::findOrFail($id);

        if(!$data) {
            return response()->json([
                'status' => false,
                'message' => 'Request tidak ada'
            ]);
        }

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function approve($id)
    {
        $request = ReimburseRequest::findOrFail($id);

        if ($request->status !== 'pending') {
            return response()->json([
                'status' => false,
                'message' => 'Request sudah diproses'
            ], 400);
        }

        $request->update([
            'status' => 'paid',
            'approved_by' => auth('api')->id(),
            'approved_at' => now()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Request approved'
        ], 200);
    }

    public function reject($id)
    {
        $request = ReimburseRequest::findOrFail($id);
        if ($request->status !== 'pending') {
            return response()->json([
                'status' => false,
                'message' => 'Request sudah diproses'
            ], 400);
        }

        $request->update([
            'status' => 'rejected',
            'approved_by' => auth('api')->id(),
            'approved_at' => now()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Request Rejected'
        ], 200);
    }
}
