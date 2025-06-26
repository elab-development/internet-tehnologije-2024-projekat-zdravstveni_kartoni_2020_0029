<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;

class TokenServiceProvider extends ServiceProvider
{
    public static function createToken($user)
    {
        $token = bin2hex(random_bytes(32));
        Cache::put('user_token_'.$token, $user->id, now()->addDays(7));
        return $token;
    }

    public static function validateToken($token)
    {
        return Cache::get('user_token_'.$token);
    }

    public static function revokeToken($token)
    {
        Cache::forget('user_token_'.$token);
    }
}
