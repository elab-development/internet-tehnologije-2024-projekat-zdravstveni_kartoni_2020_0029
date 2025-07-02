<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ExaminationFactory extends Factory
{
    public function definition(): array
    {
        $medicalRecord = \App\Models\MedicalRecord::factory()->create();
        
        return [
            'medical_record_id' => $medicalRecord->id,
            'doctor_id' => $medicalRecord->doctor_id,
            'doctor_name' => $medicalRecord->doctor->user->name,
            'symptom_description' => $this->generateSymptoms(),
            'examination_date' => $this->faker->dateTimeBetween($medicalRecord->opening_date, 'now'),
            'diagnosis' => $this->generateDiagnosis(),
            'therapy' => $this->generateTherapy(),
        ];
    }

    private function generateSymptoms(): string
    {
        $symptoms = [
            'Bol u grudima, otežano disanje',
            'Glavobolja, mučnina, vrtoglavica',
            'Povišena temperatura, bol u grlu',
            'Bol u zglobovima, otežano kretanje',
            'Umor, nesvestica, malaksalost'
        ];
        return $this->faker->randomElement($symptoms);
    }

    private function generateDiagnosis(): string
    {
        $diagnoses = [
            'Akutna upala grla',
            'Hipertenzija',
            'Dijabetes tip 2',
            'Migrena',
            'Bronhitis',
            'Gastritis'
        ];
        return $this->faker->randomElement($diagnoses);
    }

    private function generateTherapy(): string
    {
        $therapies = [
            'Antibiotik 7 dana, mirovanje',
            'Kontrola pritiska 2 puta dnevno',
            'Redovno merenje šećera u krvi',
            'Analgetici po potrebi',
            'Inhalacija 3 puta dnevno',
            'Dijeta, izbegavanje stresnih situacija'
        ];
        return $this->faker->randomElement($therapies);
    }

    public function forMedicalRecord($medicalRecordId)
    {
        return $this->state(fn (array $attributes) => [
            'medical_record_id' => $medicalRecordId,
            'doctor_id' => \App\Models\MedicalRecord::find($medicalRecordId)->doctor_id
        ]);
    }
}