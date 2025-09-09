<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1) ukloni FK i kolonu examination_id iz appointments
        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'examination_id')) {
                // ime FK-a je obično "appointments_examination_id_foreign"
                $table->dropForeign(['examination_id']);
                $table->dropColumn('examination_id');
            }
        });

        // 2) dodaj appointment_id u examinations (najpre nullable, pa FK)
        Schema::table('examinations', function (Blueprint $table) {
            if (!Schema::hasColumn('examinations', 'appointment_id')) {
                $table->foreignId('appointment_id')
                      ->nullable()
                      ->after('id')
                      ->constrained('appointments')
                      ->onDelete('cascade'); // ako se obriše termin, briši i pregled
            }
        });
    }

    public function down(): void
    {
        // vrati stanje unazad

        // a) ukloni appointment_id iz examinations
        Schema::table('examinations', function (Blueprint $table) {
            if (Schema::hasColumn('examinations', 'appointment_id')) {
                $table->dropForeign(['appointment_id']);
                $table->dropColumn('appointment_id');
            }
        });

        // b) vrati examination_id u appointments
        Schema::table('appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('appointments', 'examination_id')) {
                $table->foreignId('examination_id')
                      ->nullable()
                      ->constrained('examinations')
                      ->onDelete('set null');
            }
        });
    }
};

