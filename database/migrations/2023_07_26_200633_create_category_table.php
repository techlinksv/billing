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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('category');
            $table->text('comments')->nullable();
            $table->unsignedBigInteger('country_id'); 
            $table->foreign('country_id')->references('id')->on('countries');
            $table->enum('type', ['ingreso', 'egreso'])->default('ingreso');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category');
    }
};
