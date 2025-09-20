<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Examination extends Model
{
    use HasFactory;

    protected $fillable = [
        'medical_record_id',
        'doctor_id',
        'symptom_description',
        'examination_date',
        'diagnosis',
        'therapy',
    ];

    protected $casts = [
        'examination_date' => 'datetime',
    ];

    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function doctors()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }
}
