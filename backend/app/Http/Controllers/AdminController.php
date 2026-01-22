<?php

namespace App\Http\Controllers;

use App\Models\ReimburseRequest;
use App\Models\Users;

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

    public function users()
    {
        $data = Users::where('role', 'karyawan')->get();

        return response()->json([
            'status' => true,
            'data' => $data,
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
            'status' => 'approved',
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
