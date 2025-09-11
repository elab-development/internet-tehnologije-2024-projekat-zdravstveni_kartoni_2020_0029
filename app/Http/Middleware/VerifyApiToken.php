<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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

        if (!Cache::has('auth_token_' . $token)) {
            return response()->json([
                'success' => false,
                'message' => 'Nevažeći ili istekao token'
            ], 401);
        }

        $tokenData = Cache::get('auth_token_' . $token);

        // 🚨 Guard: ako nema tokena ili fali user_id u podacima
        if (!$tokenData || !isset($tokenData['user_id'])) {
            return response()->json([
                'success' => false,
                'message' => 'Token nije validan ili je istekao'
            ], 401);
        }

        $user = User::find($tokenData['user_id']);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Korisnik nije pronađen'
            ], 404);
        }

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Korisnik nije pronađen'
            ], 404);
        }

        $request->setUserResolver(fn () => $user);
            Auth::setUser($user);

        return $next($request);
    }
}
