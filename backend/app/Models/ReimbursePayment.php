<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReimbursePayment extends Model
{
    protected $fillable = [
        'reimburse_request_id',
        'bank_name',
        'account_name',
        'account_number',
        'amount',
        'transfer_date',
        'notes',
        'paid_by',
    ];

    public function reimburseRequest()
    {
        return $this->belongsTo(ReimburseRequest::class);
    }

    public function admin()
    {
        return $this->belongsTo(Users::class, 'paid_by');
    }
}
