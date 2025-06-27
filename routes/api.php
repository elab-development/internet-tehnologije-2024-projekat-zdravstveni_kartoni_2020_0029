<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\DoctorController;
use App\Http\Middleware\VerifyApiToken;

Route::middleware('api.response')->group(function () {
    // Javne rute
    Route::post('/login', [LoginController::class, 'login'])->withoutMiddleware(['web']);
    Route::post('/register', [RegisterController::class, 'register']);
    
    ;
    // Zastićene rute
    Route::middleware(VerifyApiToken::class)->group(function () {
        Route::post('/logout', [LogoutController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return response()->json([
                'success' => true,
                'user' => $request->user()
            ]);
        });

        });
});