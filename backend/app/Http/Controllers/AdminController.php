<?php

namespace App\Http\Controllers;

use App\Models\ReimburseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;


class AdminController extends Controller
{
    public function index()
    {
        $data = ReimburseRequest::where('status', 'pending')->get();

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
            'status' => 'approved',
            'approved_by' => JWTAuth::id(),
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
            'status' => 'Rejected',
            'approved_by' => auth('api')->id(),
            'approved_at' => now()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Request Rejected'
        ], 200);
    }
}
