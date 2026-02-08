<?php

namespace App\Http\Controllers;

use App\Models\ReimburseRequest;
use App\Models\ReimbursePayment;
use App\Models\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        $data = ReimburseRequest::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $data,
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
                Storage::disk('local')->delete('profile/' . $user->photo);
            }

            $filename = time() . '_profile' . $request->photo->extension();
            $request->photo->storeAs(
                'profile',
                $filename,
                'local'
            );
            $user->photo = $filename;
        }

        $user->save();


        return response()->json([
            'status' => true,
            'message' => 'Profile berhasil diupdate',
            'data' => $user,
        ], 200);
    }

    public function users()
    {
        $data = Users::where('role', 'karyawan')
            ->select('id', 'name', 'username', 'email', 'role')
            ->get();

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

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function approve(Request $request, $id)
    {
        $reimburse = ReimburseRequest::findOrFail($id);

        if ($reimburse->status !== 'pending') {
            return response()->json([
                'status' => false,
                'message' => 'Request sudah diproses'
            ], 400);
        }

        $reimburse->update([
            'status' => 'approved', // jangan paid dulu
            'admin_note' => $request->input('reason', 'Disetujui oleh admin'),
            'approved_by' => auth('api')->id(),
            'approved_at' => now()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Request approved'
        ], 200);
    }

    public function reject(Request $request, $id)
    {
        $reimburse = ReimburseRequest::findOrFail($id);

        if ($reimburse->status !== 'pending') {
            return response()->json([
                'status' => false,
                'message' => 'Request sudah diproses'
            ], 400);
        }

        if (!$request->reason) {
            return response()->json([
                'status' => false,
                'message' => 'Alasan penolakan wajib diisi'
            ], 422);
        }

        $reimburse->update([
            'status' => 'rejected',
            'admin_note' => $request->reason,
            'approved_by' => auth('api')->id(),
            'approved_at' => now()
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Request rejected'
        ], 200);
    }

    public function dashboard()
    {
    // Optimize: Use single query with conditional aggregation for all statuses
    $stats = ReimburseRequest::selectRaw('
        COUNT(*) as total_pengajuan,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as paid
    ', ['pending', 'approved', 'rejected', 'paid'])->first();

    return response()->json([
        'status' => true,
        'data' => [
            'pending' => (int) $stats->pending,
            'approved' => (int) $stats->approved,
            'rejected' => (int) $stats->rejected,
            'paid' => (int) $stats->paid,
            'total_pengajuan' => (int) $stats->total_pengajuan,
        ],
    ]);
    }

    public function delete($id)
    {
        try {
            // Cari user berdasarkan ID
            $user = Users::findOrFail($id);

            // Supaya admin tidak sengaja hapus dirinya sendiri
            if ($user->id == auth('api')->id()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Anda tidak bisa menghapus akun sendiri!'
                ], 403);
            }

            // Hapus data karyawan tersebut
            $user->delete();

            return response()->json([
                'status' => true,
                'message' => 'Karyawan berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal menghapus: ' . $e->getMessage()
            ], 500);
        }
    }

    public function pay(Request $request, $id)
    {
        $request->validate([
            'bank_name'      => 'required|string',
            'account_name'   => 'required|string',
            'account_number' => 'required|string',
            'amount'         => 'required|numeric|min:1',
            'transfer_date'  => 'required|date',
            'notes'          => 'nullable|string',
        ]);

        $reimburse = ReimburseRequest::findOrFail($id);

        // ❌ Guard
        if ($reimburse->status !== 'approved') {
            return response()->json([
                'status' => false,
                'message' => 'Reimbursement belum di-approve'
            ], 400);
        }

        DB::transaction(function () use ($request, $reimburse) {

            ReimbursePayment::create([
                'reimburse_request_id' => $reimburse->id,
                'bank_name'            => $request->bank_name,
                'account_name'         => $request->account_name,
                'account_number'       => $request->account_number,
                'amount'               => $request->amount,
                'transfer_date'        => $request->transfer_date,
                'notes'                => $request->notes,
                'paid_by'              => auth('api')->id(),
            ]);

            $reimburse->update([
                'status' => 'paid'
            ]);
        });

        return response()->json([
            'status' => true,
            'message' => 'Pembayaran berhasil dicatat'
        ]);
    }
}
