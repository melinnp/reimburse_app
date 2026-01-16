<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimburseApproval extends Model
{
    protected $fillable = [
        // Masukkan tabel yang ingin diproteksi, contoh 'reimburse_request_1"
    ];

    // Approval untuk 1 request
    public function request()
    {
        return $this->belongsTo(ReimburseRequest::class, 'reimburse_request_id');
    }

    // Approval dilakukan oleh admin
    public function approver()
    {
        return $this->belongsTo(Users::class, 'approved_by');
    }
}
