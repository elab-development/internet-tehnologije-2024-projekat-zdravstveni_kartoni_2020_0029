<?php

namespace Database\Seeders;

use App\Models\Examination;
use App\Models\MedicalRecord;
use App\Models\Doctor;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ExaminationSeeder extends Seeder
{
    public function run()
    {
        $medicalRecords = MedicalRecord::with('doctor.user')->get();

        foreach ($medicalRecords as $record) {
            $examinationCount = rand(1, 5);
            
            for ($i = 0; $i < $examinationCount; $i++) {
                $doctor = $record->doctor;
                
                Examination::create([
                    'medical_record_id' => $record->id,
                    'doctor_id' => $doctor->id,
                    'doctor_name' => $doctor->user->name,
                    'symptom_description' => $this->generateSymptoms(),
                    'examination_date' => $this->generateExaminationDate($record->opening_date),
                    'diagnosis' => $this->generateDiagnosis(),
                    'therapy' => $this->generateTherapy(),
                ]);
            }
        }
    }

    private function generateSymptoms()
    {
        $symptoms = [
            'Bol u grudima, otežano disanje',
            'Glavobolja, mučnina, vrtoglavica',
            'Povišena temperatura, bol u grlu',
            'Bol u zglobovima, otežano kretanje',
            'Umor, nesvestica, malaksalost'
        ];
        return $symptoms[array_rand($symptoms)];
    }

    private function generateExaminationDate($openingDate)
    {
        return Carbon::parse($openingDate)
            ->addDays(rand(1, 365))
            ->format('Y-m-d H:i:s');
    }

    private function generateDiagnosis()
    {
        $diagnoses = [
            'Akutna upala grla',
            'Hipertenzija',
            'Dijabetes tip 2',
            'Migrena',
            'Bronhitis',
            'Gastritis'
        ];
        return $diagnoses[array_rand($diagnoses)];
    }

    private function generateTherapy()
    {
        $therapies = [
            'Antibiotik 7 dana, mirovanje',
            'Kontrola pritiska 2 puta dnevno',
            'Redovno merenje šećera u krvi',
            'Analgetici po potrebi',
            'Inhalacija 3 puta dnevno',
            'Dijeta, izbegavanje stresnih situacija'
        ];
        return $therapies[array_rand($therapies)];
    }
}