<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NurseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->create([
                'role' => 'nurse',
            ])->id,
            'department' => $this->faker->randomElement([
                'Opšta nega',
                'Pedijatrija',
                'Intenzivna nega',
                'Ginekologija',
                'Interna medicina',
            ]),
        ];
    }
}
