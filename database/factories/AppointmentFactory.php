<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Nurse;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'nurse_id' => Nurse::inRandomOrder()->first()?->id ?? Nurse::factory(),
            'medical_record_id' => MedicalRecord::inRandomOrder()->first()?->id ?? MedicalRecord::factory(),
            'doctor_id' => Doctor::inRandomOrder()->first()?->id ?? Doctor::factory(),
            'scheduled_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
            'appointment_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $this->faker->randomElement(['scheduled', 'completed', 'canceled', 'no_show']),
        ];
    }
}
