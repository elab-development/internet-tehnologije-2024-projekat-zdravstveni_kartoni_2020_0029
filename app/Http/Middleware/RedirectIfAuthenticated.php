<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    public function handle($request, Closure $next, $guard = null): Response
    {
        if (Auth::guard($guard)->check()) {
            // API odgovor umesto redirecta
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already logged in'
                ], 403);
            }
            
            return redirect('/home');
        }

        return $next($request);
    }
}