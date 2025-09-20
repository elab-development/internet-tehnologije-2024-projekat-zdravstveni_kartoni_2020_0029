<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AppointmentDoctorSeeder extends Seeder
{
    public function run()
    {
        $doctorIds = DB::table('doctors')->pluck('id')->toArray();

        if (!empty($doctorIds)) {
            $appointments = DB::table('appointments')->get();

            foreach ($appointments as $appointment) {
                $randomDoctor = $doctorIds[array_rand($doctorIds)];
                DB::table('appointments')
                    ->where('id', $appointment->id)
                    ->update(['doctor_id' => $randomDoctor]);
            }
        }
    }
}
