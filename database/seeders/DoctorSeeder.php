<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Database\Seeder;

class DoctorSeeder extends Seeder
{
    public function run()
    {
        $users = User::where('role', 'doctor')->get();
        $specializations = ['Kardiolog', 'Neurolog', 'Hirurg', 'Pedijatar', 'Ortoped'];

        foreach ($users as $index => $user) {
            Doctor::create([
                'user_id' => $user->id,
                'specialization' => $specializations[$index % count($specializations)],
                'description' => $this->generateDoctorDescription($specializations[$index % count($specializations)]),
            ]);
        }
    }

    private function generateDoctorDescription($specialization)
    {
        $descriptions = [
            'Specijalista sa višegodišnjim iskustvom u oblasti ' . $specialization,
            'Diplomirani lekar specijalizacije ' . $specialization . ' sa brojnim uspešnim intervencijama',
            'Isusan stručnjak za ' . $specialization . ', autor više naučnih radova',
            'Klinika za ' . $specialization . ', član Evropskog udruženja lekara'
        ];
        return $descriptions[array_rand($descriptions)];
    }
}