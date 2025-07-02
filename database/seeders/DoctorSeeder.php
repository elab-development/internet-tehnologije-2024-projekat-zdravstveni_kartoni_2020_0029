<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run()
    {
        // Doctors are automatically created by UserFactory's configure() method
        // We just need to ensure their specializations are set
        $users = User::where('role', 'doctor')->get();
        
        foreach ($users as $user) {
            Doctor::factory()->create(['user_id' => $user->id]);
        }
    }
}