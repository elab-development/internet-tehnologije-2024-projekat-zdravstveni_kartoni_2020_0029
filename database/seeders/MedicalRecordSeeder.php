<?php

namespace Database\Seeders;

use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Doctor;
use App\Enums\BloodType;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MedicalRecordSeeder extends Seeder
{
    public function run()
    {
        $patients = Patient::all();
        $doctors = Doctor::all();

        foreach ($patients as $patient) {
            MedicalRecord::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctors->random()->id,
                'blood_type' => $this->getRandomBloodType(),
                'allergies' => $this->generateAllergies(),
                'chronic_diseases' => $this->generateChronicDiseases(),
                'opening_date' => Carbon::now()->subDays(rand(1, 365)),
                'notes' => $this->generateMedicalNotes(),
            ]);
        }
    }

    private function getRandomBloodType()
    {
        $bloodTypes = BloodType::cases();
        return $bloodTypes[array_rand($bloodTypes)]->value;
    }

    private function generateAllergies()
    {
        $allergies = ['Penicilin', 'Prašina', 'Polen', 'Latex', 'Jaja', 'Mleko'];
        $count = rand(0, 2);
        
        if ($count === 0) {
            return null;
        }
        
        shuffle($allergies);
        return array_slice($allergies, 0, $count);
    }

    private function generateChronicDiseases()
    {
        $diseases = ['Hipertenzija', 'Dijabetes tip 2', 'Astma', 'Hronična opstruktivna bolest pluća', 'Artritis'];
        $count = rand(0, 2);
        
        if ($count === 0) {
            return null;
        }
        
        shuffle($diseases);
        return array_slice($diseases, 0, $count);
    }

    private function generateMedicalNotes()
    {
        $notes = [
            'Pacijent redovno dolazi na kontrole',
            'Potrebna dodatna dijagnostika',
            'Stabilno stanje, terapija deluje',
            'Preporučena promena načina života',
            'Potrebna kontrola za 3 meseca'
        ];
        return $notes[array_rand($notes)];
    }
}