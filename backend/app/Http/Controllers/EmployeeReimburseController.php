<?php

namespace App\Http\Controllers;

use App\Models\ReimburseRequest;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class EmployeeReimburseController extends Controller
{
    public function index()
    {
        $data = ReimburseRequest::where('user_id', JWTAuth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status'  => true,
            'data' => $data
        ]);
    }
    public function create(Request $request)
    {
        $data = ReimburseRequest::create([
            'user_id' => auth('api')->id(),
            'item' => $request->item,
            'deskripsi' => $request->deskripsi,
            'jumlah' => $request->jumlah,
            'tanggal_pengajuan' => now(),
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'berhasil',
            'data' => $data,
        ]);
    }
}
