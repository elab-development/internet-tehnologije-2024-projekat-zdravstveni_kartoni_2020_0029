<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Globalni middleware
        $middleware->append([
            \App\Http\Middleware\ApiResponseMiddleware::class,
            \Illuminate\Http\Middleware\HandleCors::class
        ]);

        // API middleware grupa
        $middleware->group('api', [
           // \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        // Aliasi za middleware
        $middleware->alias([
            'auth' => \App\Http\Middleware\Authenticate::class,
            'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
            'api.response' => \App\Http\Middleware\ApiResponseMiddleware::class,
            'auth.token' => \App\Http\Middleware\VerifyApiToken::class,
            'cors', \Illuminate\Http\Middleware\HandleCors::class
        ]);
    // Dodaj CORS middleware u globalni middleware stack
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // API error handling
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500);
            }
        });
    })
    ->create();