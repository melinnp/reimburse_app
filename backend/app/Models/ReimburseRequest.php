<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimburseRequest extends Model
{
    protected $fillable = [
        // Masukkan tabel yang ingin diproteksi, contoh 'user_id' dll
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
