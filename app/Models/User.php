<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    public const ROLE = [
        'ADMIN' => 'admin',
        'DOCTOR' => 'doctor',
        'PATIENT' => 'patient',
    ];

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE['ADMIN'];
    }

    public function isDoctor(): bool
    {
        return $this->role === self::ROLE['DOCTOR'];
    }

    public function isPatient(): bool
    {
        return $this->role === self::ROLE['PATIENT'];
    }

    public function doctorProfile()
    {
        return $this->hasOne(Doctor::class);
    }

    public function patientProfile()
    {
        return $this->hasOne(Patient::class);
    }
}