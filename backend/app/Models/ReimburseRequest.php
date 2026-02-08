<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimburseRequest extends Model
{
    protected $fillable = [
        'user_id',
        'kategori',
        'tanggal_nota',
        'mata_uang',
        'nomor_rekening',
        'nominal',
        'keterangan',
        'nota',
        'status',
        'admin_note',
    ];

    protected $appends = [
        'nota_url',
        'tanggal_format',
        'nominal_format',
        'tanggal_iso',
    ];

    protected $casts = [
        'tanggal_nota' => 'date',
    ];

    public function getTanggalFormatAttribute()
    {
        return $this->tanggal_nota
            ? $this->tanggal_nota->format('d/m/Y')
            : null;
    }

    public function getTanggalIsoAttribute()
    {
        return $this->tanggal_nota
            ? $this->tanggal_nota->format('Y-m-d')
            : null;
    }

    public function getNominalFormatAttribute()
    {
        return number_format($this->nominal, 0, ',', '.');
    }

    public function getNotaUrlAttribute()
    {
        return $this->nota
            ? asset('storage/nota/' . $this->nota)
            : null;
    }

    // Relasi dengan User
    public function user()
    {
        return $this->belongsTo(Users::class, 'user_id');
    }

    public function payment()
    {
        return $this->hasOne(ReimbursePayment::class);
    }
}
