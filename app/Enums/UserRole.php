<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case DOCTOR = 'doctor';
    case PATIENT = 'patient';

    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::DOCTOR => 'Doktor',
            self::PATIENT => 'Pacijent',
        };
    }
}