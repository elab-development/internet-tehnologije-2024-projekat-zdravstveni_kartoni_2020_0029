<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class VerifyApiToken
{
   public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token || !Cache::has('auth_token_'.$token)) {
            return response()->json([
                'success' => false,
                'message' => 'Nevažeći token'
            ], 401);
        }

        // Postavi trenutno ulogovanog korisnika
        $tokenData = Cache::get('auth_token_'.$token);
        Auth::onceUsingId($tokenData['user_id']);

        return $next($request);
    }
}
