<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create admin using factory state
        User::factory()->admin()->create([
            'name' => 'Admin Administrator',
            'email' => 'admin@klinika.rs',
            'password' => 'admin123', // Factory will hash it
        ]);

        // Create 5 doctors using factory
        User::factory()->doctor()->count(5)->create();

        // Create 20 patients using factory
        User::factory()->patient()->count(20)->create();
    }
}