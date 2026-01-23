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

        if (!$request) {
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

    public function store(Request $request)
    {
        $request->validate([
            'kategori' => 'required|string',
            'tanggal' => 'required|date',
            'mata_uang' => 'required|in:IDR,USD',
            'nominal' => 'required|numeric|min:1',
            'keterangan' => 'required|string',
            'nota' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // simpan file
        $notaPath = $request->file('nota')->store('nota', 'public');

        $pengajuan = ReimburseRequest::create([
            'user_id' => auth('api')->id(), // 🔥 DARI TOKEN
            'kategori' => $request->kategori,
            'tanggal_nota' => $request->tanggal,
            'mata_uang' => $request->mata_uang,
            'nominal' => $request->nominal,
            'keterangan' => $request->keterangan,
            'nota_path' => $notaPath,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Pengajuan berhasil dikirim',
            'data' => $pengajuan
        ], 201);
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
