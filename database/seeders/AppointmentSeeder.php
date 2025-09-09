<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use App\Models\User;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $records = MedicalRecord::all();
        $users   = User::all();

        if ($records->isEmpty() || $users->isEmpty()) {
            $this->command->warn('Nema dovoljno podataka za appointments.');
            return;
        }

        foreach (range(1, 20) as $i) {
            Appointment::create([
                'user_id'          => $users->random()->id,       // ko je zakazao
                'medical_record_id'=> $records->random()->id,     // kome pripada termin
                'scheduled_at'     => now()->subDays(rand(0, 7)), // kada je zakazano
                'appointment_date' => now()->addDays(rand(1, 30)),// kada će se održati
                'status'           => collect(['scheduled','completed','canceled','no_show'])->random(),
            ]);
        }
    }
}





