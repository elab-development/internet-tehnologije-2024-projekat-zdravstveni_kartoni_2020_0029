<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Enums\Gender;
use Carbon\Carbon;

class PatientSeeder extends Seeder
{
    public function run()
    {
        $users = User::where('role', 'patient')->get();

        foreach ($users as $user) {
            Patient::create([
                'user_id' => $user->id,
                'jmbg' => $this->generateJMBG(),
                'date_of_birth' => $this->generateBirthDate(),
                'gender' => $this->generateGender(),
            ]);
        }
    }

    private function generateJMBG()
    {
        $day = str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT);
        $month = str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT);
        $year = rand(1950, 2000);
        $region = rand(10, 19);
        $uniqueNum = str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        
        // Generiši kontrolnu cifru (pojednostavljeno)
        $controlDigit = rand(0, 9);
        
        return $day . $month . substr($year, -2) . $region . $uniqueNum . $controlDigit;
    }

    private function generateBirthDate()
    {
        return Carbon::now()
            ->subYears(rand(18, 80))
            ->subDays(rand(0, 365))
            ->format('Y-m-d');
    }

    private function generateGender()
    {
        $genders = Gender::cases();
        return $genders[array_rand($genders)]->value;
    }
}