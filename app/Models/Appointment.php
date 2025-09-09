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
        'scheduled_at',
        'appointment_date',
        'status',
    ];

    // Relacije

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Vezan medical record
    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function examination()
    {
        return $this->belongsTo(Examination::class);
    }
}
