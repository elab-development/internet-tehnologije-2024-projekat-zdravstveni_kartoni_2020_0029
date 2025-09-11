<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS (JWT / Bearer)
    |--------------------------------------------------------------------------
    | Za SPA na Vite-u (5173) i API na Laravel-u (8000).
    */

    "paths" => ["api/*"], // npr. /api/login, /api/users...

    "allowed_methods" => ["*"],

    "allowed_origins" => [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],

    "allowed_origins_patterns" => [],

    "allowed_headers" => ["*"], // ili eksplicitno: "Authorization", "Content-Type", ...

    "exposed_headers" => [],

    "max_age" => 0,

    // JWT: nema credentials (cookies), ostaje false
    "supports_credentials" => false,
];
