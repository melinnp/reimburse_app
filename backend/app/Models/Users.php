<?php

namespace App\Models;

use App\Http\Controllers\ApprovalController;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Users extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = ['password'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // 1 user mempunyai banyak reimburse request
    public function reimburseRequest()
    {
        return $this->hasMany(ReimburseRequest::class);
    }

    // 1 admin bisa banyak approval
    public function approvals()
    {
        return $this->hasMany(ReimburseApproval::class, 'approved_by');
    }
}
