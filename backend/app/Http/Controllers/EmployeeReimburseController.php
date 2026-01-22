<?php

namespace App\Http\Controllers;

use App\Models\ReimburseRequest;
use Illuminate\Http\Request;

class EmployeeReimburseController extends Controller
{
    public function index()
    {
        $data = ReimburseRequest::where('user_id', auth('api')->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status'  => true,
            'data' => $data
        ]);
    }

    public function me()
    {
        $data = auth('api')->user();

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $userId = auth('api')->id();

        $request = ReimburseRequest::where('id', $id)
        ->where('user_id', $userId)
        ->first();

        if(!$request) {
            return response()->json([
                'status' => false,
                'message' => 'Request tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $request,
        ]);
    }

    public function create(Request $request)
    {
        $userId = auth('api')->id();

        $data = ReimburseRequest::create([
            'user_id' => $userId,
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

    public function delete($id)
    {
        $userId = auth('api')->id();

        $request = ReimburseRequest::where('id', $id)
        ->where('user_id', $userId)
        ->firstOrFail();

        $request->delete();

        return response()->json([
            'status' => true,
            'message' => 'Request berhasil dihapus',
        ]);
    }
}
