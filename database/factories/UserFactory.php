<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName() . ' ' . $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => $this->faker->randomElement(['admin', 'doctor', 'patient']),
            'remember_token' => Str::random(10),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (\App\Models\User $user) {
            if ($user->role === 'doctor') {
                \App\Models\Doctor::factory()->create(['user_id' => $user->id]);
            } elseif ($user->role === 'patient') {
                \App\Models\Patient::factory()->create(['user_id' => $user->id]);
            }
        });
    }

    public function admin()
    {
        return $this->state(fn (array $attributes) => ['role' => 'admin']);
    }

    public function doctor()
    {
        return $this->state(fn (array $attributes) => ['role' => 'doctor']);
    }

    public function patient()
    {
        return $this->state(fn (array $attributes) => ['role' => 'patient']);
    }
}