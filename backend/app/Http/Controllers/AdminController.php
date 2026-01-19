<?php

namespace App\Http\Controllers;

use App\Models\ReimburseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
 HEAD
    public function index()
    {
        return response()->json([
            'message' => 'JALAN'
        ]);
    }

    public function approve($id)
    {
        return response()->json([
            'message' => 'reimburse $id approve'
        ]);
    }

    public function reject($id)
    {
        return response()->json([
            'message' => 'reimburse $id rejected'
        ]);
    // contoh/gambaran kasar

    // ambil semua request dgn status pending
    public function index()
    {
        $data = ReimburseRequest::where('status', 'pending')->get();

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    // approve request
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

    // reject request
    public function reject($id)
    {
        $request = ReimburseRequest::where('status', 'pending')->get();

        if ($request->status !== 'pending') {
            return response()->json([
                'status' => false,
                'message' => 'Request sudah diproses'
            ], 400); 
        }

        $request->update([
            'status' => 'Rejected',
            'approved_by' => JWTAuth::id(),
            'approved_at' => now()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Request Rejected'
        ], 200);fb00ed3cca59d3bd478fd4a604d0c8fe7d7a8337
    }
}
