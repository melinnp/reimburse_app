<?php

namespace Database\Seeders;

use App\Models\Users;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use Carbon\Carbon;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Users::insert([
            [
                'name' => 'Budi',
                'email' => 'e@company.com',
                'password' => Hash::make('emp123'),
                'role' => 'karyawan',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Agus',
                'email' => 'a@company.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
