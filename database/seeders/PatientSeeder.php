<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    public function run()
    {
        // Patients are automatically created by UserFactory's configure() method
        // We just need to ensure their details are set
        $users = User::where('role', 'patient')->get();
        
        foreach ($users as $user) {
            Patient::factory()->create(['user_id' => $user->id]);
        }
    }
}