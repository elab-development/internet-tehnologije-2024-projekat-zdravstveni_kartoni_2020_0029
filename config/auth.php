<?php

return [
    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        
        'api' => [
            'driver' => 'sanctum',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800, // 3 sata
    
    // Dodatne konfiguracije specifične za vaš sistem
    'roles' => [
        'admin' => 'admin',
        'doctor' => 'doctor',
        'patient' => 'patient',
    ],
    
    'redirects' => [
        'login' => '/dashboard',
        'logout' => '/login',
        'home' => '/',
    ],
];