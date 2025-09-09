<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Pogrešni kredencijali'
            ], 401);
        }

        $user = Auth::user();
        $token = $this->createAuthToken($user);

        return response()->json([
                'user' => $user->only(['id', 'name', 'email', 'role']),
                'token' => $token,
                'redirect_to' => $this->getDashboardRoute($user->role),
                'expires_in' => 28800 // 8 sati u sekundama
            
        ]);
    }

    protected function createAuthToken($user)
    {
        $token = Str::random(60);
        Cache::put('auth_token_'.$token, [
        'user_id' => $user->id,
        'role' => $user->role,
        'created_at' => now()->toDateTimeString(),
        'expires_at' => now()->addHours(8)->toDateTimeString()
    ], now()->addHours(8));

        return $token;
    }

    protected function getDashboardRoute($role)
    {
        return match($role) {
            UserRole::ADMIN->value => '/admin/dashboard',
            UserRole::DOCTOR->value => '/doctor/dashboard',
            UserRole::PATIENT->value => '/patient/dashboard',
            default => '/home',
        };
    }

}