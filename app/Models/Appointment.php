<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'medical_record_id',
        'doctor_id',
        'nurse_id',           // 👈 dodato
        'scheduled_at',
        'appointment_date',
        'status',
    ];

    // Vezan medical record
    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    // Vezan doktor
    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    // Vezana sestra
    public function nurse()
    {
        return $this->belongsTo(Nurse::class);
    }

    // Ako želiš vezu sa pregledom (1 termin → 1 pregled, opciono)
    public function examination()
    {
        return $this->hasOne(Examination::class);
    }
}
