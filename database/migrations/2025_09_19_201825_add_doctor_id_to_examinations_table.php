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
        Schema::table('examinations', function (Blueprint $table) {
            //
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('examinations', function (Blueprint $table) {
            //
        });
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('examinations', function (Blueprint $table) {
            // 1) ukloni doctor_name
            $table->dropColumn('doctor_name');

            // 2) dodaj doctor_id kao foreign key
            $table->foreignId('doctor_id')
                  ->after('id')
                  ->constrained('doctors')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('examinations', function (Blueprint $table) {
            // obrni promene
            $table->dropForeign(['doctor_id']);
            $table->dropColumn('doctor_id');

            $table->string('doctor_name')->nullable();
        });
    }
};
