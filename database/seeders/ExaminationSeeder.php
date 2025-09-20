<?php

namespace Database\Seeders;

use App\Models\Examination;
use App\Models\MedicalRecord;
use Illuminate\Database\Seeder;

class ExaminationSeeder extends Seeder
{
    public function run()
    {
        $medicalRecords = MedicalRecord::all();

        foreach ($medicalRecords as $record) {
            $examinationCount = rand(1, 5);

            Examination::factory()
                ->count($examinationCount)
                ->forMedicalRecord($record->id)
                ->create();
        }
    }
}
