<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // 1. izbaci user_id
            if (Schema::hasColumn('appointments', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }

            // 2. dodaj nurse_id
            $table->foreignId('nurse_id')
                ->nullable()
                ->constrained('nurses')
                ->onDelete('cascade')
                ->after('id');
        });

        // 3. popuni nurse_id random sestrama
        $nurseIds = DB::table('nurses')->pluck('id')->toArray();

        if (!empty($nurseIds)) {
            $appointments = DB::table('appointments')->get();

            foreach ($appointments as $appointment) {
                $randomNurseId = $nurseIds[array_rand($nurseIds)];
                DB::table('appointments')
                    ->where('id', $appointment->id)
                    ->update(['nurse_id' => $randomNurseId]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // vrati user_id
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('cascade')
                ->after('id');

            // izbaci nurse_id
            if (Schema::hasColumn('appointments', 'nurse_id')) {
                $table->dropForeign(['nurse_id']);
                $table->dropColumn('nurse_id');
            }
        });
    }
};
