<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class LogoutController extends Controller
{
    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            Cache::forget('auth_token_'.$token);
        }

        Auth::logout();

        return response()->json([
            'success' => true,
            'message' => 'Uspešno odjavljen'
        ]);
    }
}