<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds indexes for frequently filtered/ordered columns to speed up:
     * - AdminController::index() where status='pending'
     * - EmployeeReimburseController::index() where user_id + orderBy created_at
     * - AdminController::users() where role='karyawan'
     */
    public function up(): void
    {
        Schema::table('reimburse_requests', function (Blueprint $table) {
            $table->index('status');
            $table->index(['user_id', 'created_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reimburse_requests', function (Blueprint $table) {
            $table->dropIndex('reimburse_requests_status_index');
            $table->dropIndex('reimburse_requests_user_id_created_at_index');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('users_role_index');
        });
    }
};
