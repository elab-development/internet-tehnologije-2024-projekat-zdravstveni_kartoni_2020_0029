<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'medical_record_id',
        'doctor_id',          
        'scheduled_at',
        'appointment_date',
        'status',
    ];

    // Ko je kreirao termin (admin/nurse)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

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

    // Ako želiš vezu sa pregledom (1 termin → 1 pregled, opciono)
    public function examination()
    {
        return $this->hasOne(Examination::class);
    }
}
