<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

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
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => UserRole::class, // Casting za enum
    ];

    // Relacije
    public function doctorProfile()
    {
        return $this->hasOne(Doctor::class);
    }

    public function patientProfile()
    {
        return $this->hasOne(Patient::class);
    }

    // Helper metode za proveru uloga
    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN;
    }

    public function isDoctor(): bool
    {
        return $this->role === UserRole::DOCTOR;
    }

    public function isPatient(): bool
    {
        return $this->role === UserRole::PATIENT;
    }

    // Scope metode za filtriranje po ulozi
    public function scopeAdmins($query)
    {
        return $query->where('role', UserRole::ADMIN);
    }

    public function scopeDoctors($query)
    {
        return $query->where('role', UserRole::DOCTOR);
    }

    public function scopePatients($query)
    {
        return $query->where('role', UserRole::PATIENT);
    }
}