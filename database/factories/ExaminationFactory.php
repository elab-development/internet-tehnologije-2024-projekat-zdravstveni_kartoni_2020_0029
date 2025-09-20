<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\MedicalRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExaminationFactory extends Factory
{
    public function definition(): array
    {
        // napravi medical record ako nema
        $medicalRecord = MedicalRecord::factory()->create();

        // uzmi random doktora ili kreiraj jednog
        $doctor = Doctor::inRandomOrder()->first() ?? Doctor::factory()->create();

        return [
            'medical_record_id' => $medicalRecord->id,
            'doctor_id' => $doctor->id,
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

    // Ako želiš da eksplicitno dodaš record
    public function forMedicalRecord($medicalRecordId)
    {
        return $this->state(fn (array $attributes) => [
            'medical_record_id' => $medicalRecordId,
            'doctor_id' => Doctor::inRandomOrder()->first()?->id ?? Doctor::factory()->create()->id,
        ]);
    }
}
