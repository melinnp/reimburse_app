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
        Schema::create('reimburse_payments', function (Blueprint $table) {
            $table->id();
        
            $table->foreignId('reimburse_request_id')
                ->constrained('reimburse_requests')
                ->onDelete('cascade');
        
            $table->string('bank_name');
            $table->string('account_name');
            $table->string('account_number');
        
            $table->decimal('amount', 15, 2);
            $table->date('transfer_date');
        
            $table->text('notes')->nullable();
        
            $table->foreignId('paid_by')
                ->constrained('users'); // admin
        
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_payments');
    }
};
