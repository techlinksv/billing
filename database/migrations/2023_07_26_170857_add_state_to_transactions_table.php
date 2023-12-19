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
        Schema::table('transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('country_id'); 
            $table->foreign('country_id')->references('id')->on('countries');
            $table->enum('type', ['ingreso', 'egreso', 'anulado'])->default('ingreso');
            $table->enum('method', ['efectivo', 'cheque', 'anulado'])->default('ingreso');
            $table->text('check_number')->nullable();
            $table->text('bank')->nullable();
            $table->date('date')->useCurrent();
            $table->text('reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            //
        });
    }
};
