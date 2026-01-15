<?php

namespace Database\Seeders;

use App\Models\Users;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

use function Illuminate\Support\now;

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
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Agus',
                'email' => 'a@company.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
