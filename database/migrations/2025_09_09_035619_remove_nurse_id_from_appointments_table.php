<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // prvo obriši strani ključ, pa kolonu
            if (Schema::hasColumn('appointments', 'nurse_id')) {
                $table->dropForeign(['nurse_id']);
                $table->dropColumn('nurse_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->foreignId('nurse_id')
                  ->constrained('nurses')
                  ->onDelete('cascade');
        });
    }
};

