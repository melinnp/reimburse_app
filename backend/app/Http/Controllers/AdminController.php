<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'JALAN'
        ]);
    }

    public function approve($id)
    {
        return response()->json([
            'message' => 'reimburse $id approve'
        ]);
    }

    public function reject($id)
    {
        return response()->json([
            'message' => 'reimburse $id rejected'
        ]);
    }
}
