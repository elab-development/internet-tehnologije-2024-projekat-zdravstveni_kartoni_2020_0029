<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
{
    Schema::table('appointments', function (Blueprint $table) {
        $table->dropForeign(['doctor_id']);
        $table->dropForeign(['patient_id']);
        $table->dropColumn(['doctor_id', 'patient_id']);

        // 1. dodaj nullable kolonu bez FK
        $table->unsignedBigInteger('medical_record_id')->nullable()->after('nurse_id');
    });

    // 2. sad odvojeno dodaj FK constraint
    Schema::table('appointments', function (Blueprint $table) {
        $table->foreign('medical_record_id')
              ->references('id')
              ->on('medical_records')
              ->onDelete('cascade');
    });
}


    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // ukloni medical_record_id
            $table->dropForeign(['medical_record_id']);
            $table->dropColumn('medical_record_id');

            // vrati doctor_id i patient_id
            $table->foreignId('doctor_id')->constrained('doctors')->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
        });
    }
};


