<?php

namespace App\Http\Controllers;

use App\Models\ReimburseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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

    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        // \Log::info('User authenticated:', ['user_id' => $user->id]);
        // \Log::info('Request data:', $request->all());

        $request->validate([
            'username' => 'sometimes|required|string|unique:users,username,' . $user->id,
            'email'    => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|min:6',
            'photo'    => 'sometimes|image|max:2048',
        ]);

        if ($request->has('username')) {
            $user->username = $request->username;
            $user->name = $request->username;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('photo')) {
            if ($user->photo) {
                Storage::delete('profile/' . $user->photo);
            }

            $filename = time() . '.' . $request->photo->extension();
            $request->photo->storeAs('profile', $filename);
            $user->photo = $filename;
        }

        $user->save();

        // \Log::info('User after save:', $user->toArray());

        return response()->json([
            'status' => true,
            'message' => 'Profile berhasil diupdate',
            'data' => $user,
        ], 200);
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
            'tanggal_nota' => 'required|date',
            'mata_uang' => 'required|in:IDR,USD',
            'nominal' => 'required|numeric|min:1',
            'keterangan' => 'required|string',
            'nota' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // simpan file
        $filename = time() . '_nota.' . $request->file('nota')->extension();
        $request->file('nota')->storeAs('nota', $filename);

        $pengajuan = ReimburseRequest::create([
            'user_id' => auth('api')->id(),
            'kategori' => $request->kategori,
            'tanggal_nota' => $request->tanggal_nota,
            'mata_uang' => $request->mata_uang,
            'nominal' => $request->nominal,
            'keterangan' => $request->keterangan,
            'nota_path' => $filename,
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
