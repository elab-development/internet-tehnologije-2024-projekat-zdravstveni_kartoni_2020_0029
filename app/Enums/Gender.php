<?php

namespace App\Enums;

enum Gender: string
{
    case MALE = 'male';
    case FEMALE = 'female';
    case OTHER = 'other';

    public function label(): string
    {
        return match($this) {
            self::MALE => 'Muški',
            self::FEMALE => 'Ženski',
            self::OTHER => 'Drugo',
        };
    }
}