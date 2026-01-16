<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reimburse_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reimburse_request_id')->constrained('reimburse_requests')->onDelete('cascade');
            $table->foreignId('approved_by')->constrained('users');
            $table->enum('status', ['pending', 'paid', 'reject'])->default('pending');
            $table->text('catatan')->nullable();
            $table->date('tanggal_approve');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_approvals');
    }
};
