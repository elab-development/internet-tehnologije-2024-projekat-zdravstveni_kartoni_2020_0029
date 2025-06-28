<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\DoctorController;
use App\Http\Middleware\VerifyApiToken;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\ExaminationController;

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

        // Rute za zdravstvene kartone
        Route::get('/medical-records', [MedicalRecordController::class, 'index']);
        Route::get('/medical-records/{id}', [MedicalRecordController::class, 'show']);
        Route::put('/medical-records/{id}', [MedicalRecordController::class, 'update']);
    
        // Rute za preglede
        Route::post('/examinations', [ExaminationController::class, 'store']);
        Route::get('/examinations', [ExaminationController::class, 'index']);
        Route::put('/examinations/{id}', [ExaminationController::class, 'update']);

        });
});