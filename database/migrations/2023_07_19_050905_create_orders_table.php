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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->foreign('client_id')->references('id')->on('clients');
            $table->string('client_company')->nullable();
            $table->string('client_first_name')->nullable();
            $table->string('client_last_name')->nullable();
            $table->string('client_document_1')->nullable();
            $table->string('client_document_2')->nullable();
            $table->enum('payment_type',['credito','efectivo'])->default('efectivo');
            $table->text('comments')->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
