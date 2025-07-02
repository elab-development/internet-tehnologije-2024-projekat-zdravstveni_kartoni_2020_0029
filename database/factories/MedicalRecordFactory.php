<?php

namespace Database\Factories;

use App\Enums\BloodType;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicalRecordFactory extends Factory
{
    public function definition(): array
    {
        return [
            'patient_id' => \App\Models\Patient::factory(),
            'doctor_id' => \App\Models\Doctor::factory(),
            'blood_type' => $this->faker->randomElement(BloodType::cases())->value,
            'allergies' => $this->generateAllergies(),
            'chronic_diseases' => $this->generateChronicDiseases(),
            'opening_date' => $this->faker->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            'notes' => $this->faker->optional(0.7)->paragraph(),
        ];
    }

    private function generateAllergies(): ?array
    {
        $allergies = ['Penicilin', 'Prašina', 'Polen', 'Latex', 'Jaja', 'Mleko'];
        
        return $this->faker->boolean(70) 
            ? $this->faker->randomElements($allergies, $this->faker->numberBetween(1, 2))
            : null;
    }

    private function generateChronicDiseases(): ?array
    {
        $diseases = ['Hipertenzija', 'Dijabetes tip 2', 'Astma', 'Hronična bolest pluća', 'Artritis'];
        
        return $this->faker->boolean(60)
            ? $this->faker->randomElements($diseases, $this->faker->numberBetween(1, 2))
            : null;
    }

    public function withPatient($patientId)
    {
        return $this->state(fn (array $attributes) => [
            'patient_id' => $patientId
        ]);
    }

    public function withDoctor($doctorId)
    {
        return $this->state(fn (array $attributes) => [
            'doctor_id' => $doctorId
        ]);
    }
}