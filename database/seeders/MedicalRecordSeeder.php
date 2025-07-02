<?php

namespace Database\Seeders;

use App\Enums\BloodType;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Database\Seeder;

class MedicalRecordSeeder extends Seeder
{
    public function run()
    {
        // Get all patients and doctors to associate with medical records
        $patients = Patient::all();
        $doctors = Doctor::all();

        if ($patients->isEmpty() || $doctors->isEmpty()) {
            $this->command->info('No patients or doctors found. Please seed patients and doctors first.');
            return;
        }

        // Create medical records for each patient
        foreach ($patients as $patient) {
            MedicalRecord::factory()
                ->withPatient($patient->id)
                ->withDoctor($doctors->random()->id)
                ->create();
        }

        $this->command->info('Medical records seeded successfully!');
    }
}