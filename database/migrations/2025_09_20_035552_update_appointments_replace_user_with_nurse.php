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
        Schema::table('appointments', function (Blueprint $table) {
            // 1. Uklonimo user_id ako postoji FK
            if (Schema::hasColumn('appointments', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }

            // 2. Dodamo nurse_id umesto user_id
            $table->unsignedBigInteger('nurse_id')->nullable()->after('doctor_id');
            $table->foreign('nurse_id')->references('id')->on('nurses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Vrati user_id
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Ukloni nurse_id
            $table->dropForeign(['nurse_id']);
            $table->dropColumn('nurse_id');
        });
    }
};
