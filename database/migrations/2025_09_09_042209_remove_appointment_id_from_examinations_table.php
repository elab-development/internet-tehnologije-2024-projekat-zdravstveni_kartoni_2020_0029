<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('examinations', function (Blueprint $table) {
            if (Schema::hasColumn('examinations', 'appointment_id')) {
                $table->dropForeign(['appointment_id']);
                $table->dropColumn('appointment_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('examinations', function (Blueprint $table) {
            if (!Schema::hasColumn('examinations', 'appointment_id')) {
                $table->foreignId('appointment_id')
                      ->nullable()
                      ->constrained('appointments')
                      ->onDelete('cascade');
            }
        });
    }
};

