<?php

namespace Database\Seeders;

use App\Models\Nurse;
use Illuminate\Database\Seeder;

class NurseSeeder extends Seeder
{
    public function run()
    {
        Nurse::factory()->count(10)->create();
    }
}
