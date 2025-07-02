<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DoctorFactory extends Factory
{
    public function definition(): array
    {
        $specializations = ['Kardiolog', 'Neurolog', 'Hirurg', 'Pedijatar', 'Ortoped'];
        
        return [
            'user_id' => \App\Models\User::factory(),
            'specialization' => $this->faker->randomElement($specializations),
            'description' => $this->faker->paragraph(),
        ];
    }

    public function withSpecialization(string $specialization)
    {
        return $this->state(fn (array $attributes) => [
            'specialization' => $specialization
        ]);
    }
}