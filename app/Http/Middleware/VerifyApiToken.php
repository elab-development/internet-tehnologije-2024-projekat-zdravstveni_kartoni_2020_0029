<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\User;

class VerifyApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token nije pronađen'
            ], 401);
        }

        if (!Cache::has('auth_token_'.$token)) {
            return response()->json([
                'success' => false,
                'message' => 'Nevažeći ili istekao token'
            ], 401);
        }

        $tokenData = Cache::get('auth_token_'.$token);
        $user = User::find($tokenData['user_id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Korisnik nije pronađen'
            ], 404);
        }

        // Ručno postavite korisnika na request
        $request->merge(['auth_user' => $user]);
        $request->setUserResolver(function() use ($user) {
            return $user;
        });

        return $next($request);
    }
}