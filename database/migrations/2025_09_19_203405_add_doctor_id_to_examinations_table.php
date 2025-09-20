<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('examinations', function (Blueprint $table) {
            $table->foreignId('doctor_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('doctors')
                  ->nullOnDelete();
        });

        // Popuni kolonu random doktorima koji već postoje
        $doctorIds = DB::table('doctors')->pluck('id')->toArray();
        if (!empty($doctorIds)) {
            $examinations = DB::table('examinations')->get();
            foreach ($examinations as $exam) {
                DB::table('examinations')
                    ->where('id', $exam->id)
                    ->update([
                        'doctor_id' => $doctorIds[array_rand($doctorIds)]
                    ]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('examinations', function (Blueprint $table) {
            $table->dropForeign(['doctor_id']);
            $table->dropColumn('doctor_id');
        });
    }
};
