<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        
    \App\Http\Middleware\TrustProxies::class,
    \Illuminate\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\ApiResponseMiddleware::class,
    ];

    protected $middlewareGroups = [
        'api' => [
            \App\Http\Middleware\ApiResponseMiddleware::class,
            \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    protected $routeMiddleware = [
        //'auth' => \App\Http\Middleware\Authenticate::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'api.response' => \App\Http\Middleware\ApiResponseMiddleware::class,
        'verify.token' => \App\Http\Middleware\VerifyApiToken::class,
        'role' => \App\Http\Middleware\RoleMiddleware::class,
    ];
}