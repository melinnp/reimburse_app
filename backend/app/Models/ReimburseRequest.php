<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimburseRequest extends Model
{
    protected $fillable = [
        'user_id',
        'item',
        'deskripsi',
        'jumlah',
        'tanggal_pengajuan',
        'status',
    ];

    // Request milik 1 user
    public function user()
    {
        return $this->belongsTo(Users::class);
    }

    // Request punya 1 approval
    public function approval()
    {
        return $this->hasOne(ReimburseApproval::class);
    }
}
