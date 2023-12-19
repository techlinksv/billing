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
        Schema::table('clients', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->string('document_2')->nullable()->change();
            $table->string('document_3')->nullable()->change();
            $table->string('phone')->nullable()->change();
            $table->string('phone_2')->nullable()->change();
            $table->text('comments')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
