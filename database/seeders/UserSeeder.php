<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    private $usedEmails = [];

    public function run()
    {
        // Admin
        User::create([
            'name' => 'Admin Administrator',
            'email' => 'admin@klinika.rs',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Doktori
        for ($i = 0; $i < 5; $i++) {
            $this->createDoctorUser($i);
        }

        // Pacijenti
        for ($i = 0; $i < 20; $i++) {
            $this->createPatientUser($i);
        }
    }

    private function createDoctorUser($index)
    {
        $ime = $this->generateFirstName();
        $prezime = $this->generateLastName();
        $email = $this->generateUniqueEmail($ime, $prezime, 'klinika.rs');

        User::create([
            'name' => $ime . ' ' . $prezime,
            'email' => $email,
            'password' => Hash::make('doktor123'),
            'role' => 'doctor',
        ]);
    }

    private function createPatientUser($index)
    {
        $ime = $this->generateFirstName();
        $prezime = $this->generateLastName();
        $email = $this->generateUniqueEmail($ime, $prezime, 'pacijent.rs');

        User::create([
            'name' => $ime . ' ' . $prezime,
            'email' => $email,
            'password' => Hash::make('pacijent123'),
            'role' => 'patient',
        ]);
    }

    private function generateUniqueEmail($ime, $prezime, $domain)
    {
        $baseEmail = Str::ascii(Str::lower($ime . '.' . $prezime));
        $email = $baseEmail . '@' . $domain;
        $counter = 1;

        while (in_array($email, $this->usedEmails)) {
            $email = $baseEmail . $counter . '@' . $domain;
            $counter++;
        }

        $this->usedEmails[] = $email;
        return $email;
    }

    private function generateFirstName()
    {
        $names = ['Ana', 'Marko', 'Jovana', 'Nikola', 'Milica', 'Stefan', 'Sofija', 'Luka', 'Ema', 'Vuk'];
        return $names[array_rand($names)];
    }

    private function generateLastName()
    {
        $lastNames = ['Petrović', 'Jovanović', 'Nikolić', 'Marković', 'Đorđević', 'Stojanović', 'Ilić', 'Pavlović'];
        return $lastNames[array_rand($lastNames)];
    }
}