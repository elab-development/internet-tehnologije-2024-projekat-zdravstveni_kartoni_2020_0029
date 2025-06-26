<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'blood_type',
        'allergies',
        'chronic_diseases',
        'opening_date',
        'notes',
    ];

    protected $casts = [
    'opening_date' => 'date',
    'allergies' => 'array',
    'chronic_diseases' => 'array',
    'blood_type' => BloodType::class,
];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function examinations()
    {
        return $this->hasMany(Examination::class);
    }
}