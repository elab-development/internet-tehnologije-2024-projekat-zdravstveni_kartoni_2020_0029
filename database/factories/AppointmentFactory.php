<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Nurse;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\Examination;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        $scheduled = $this->faker->dateTimeBetween('-1 week', 'now');
        $appointment = $this->faker->dateTimeBetween('now', '+1 month');

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'medical_record_id' => \App\Models\MedicalRecord::inRandomOrder()->first()?->id ?? \App\Models\MedicalRecord::factory(),
            'scheduled_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'appointment_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $this->faker->randomElement(['scheduled', 'completed', 'canceled', 'no_show']),
        ];

    }
}

