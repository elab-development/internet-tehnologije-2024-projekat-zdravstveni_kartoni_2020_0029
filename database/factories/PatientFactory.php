<?php

namespace Database\Factories;

use App\Enums\Gender;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(['role' => 'patient']),
            'jmbg' => $this->generateJMBG(),
            'date_of_birth' => $this->faker->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            'gender' => $this->faker->randomElement(Gender::cases())->value,
        ];
    }

    private function generateJMBG(): string
    {
        $day = str_pad($this->faker->numberBetween(1, 28), 2, '0', STR_PAD_LEFT);
        $month = str_pad($this->faker->numberBetween(1, 12), 2, '0', STR_PAD_LEFT);
        $year = str_pad($this->faker->numberBetween(50, 99), 2, '0', STR_PAD_LEFT);
        $region = str_pad($this->faker->numberBetween(70, 99), 2, '0', STR_PAD_LEFT);
        $unique = str_pad($this->faker->numberBetween(0, 999), 3, '0', STR_PAD_LEFT);
        $control = $this->faker->numberBetween(0, 9);

        return $day . $month . $year . $region . $unique . $control;
    }

    public function male()
    {
        return $this->state(fn (array $attributes) => ['gender' => 'male']);
    }

    public function female()
    {
        return $this->state(fn (array $attributes) => ['gender' => 'female']);
    }
}