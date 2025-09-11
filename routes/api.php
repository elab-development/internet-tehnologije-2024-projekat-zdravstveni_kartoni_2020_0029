<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\ExaminationController;
use App\Http\Controllers\AppointmentController;
use App\Http\Middleware\VerifyApiToken;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DoctorController;


Route::middleware("api.response")->group(function () {
    // Javne rute
    Route::post("/login", [LoginController::class, "login"])->withoutMiddleware(["api"]);
    Route::post("/register", [RegisterController::class, "register"]);

    // Zaštićene rute
    Route::middleware(VerifyApiToken::class)->group(function () {
        Route::post("/logout", [LogoutController::class, "logout"]);
        
        Route::get("/user", function (Request $request) {
            return response()->json([
                "success" => true,
                "user" => $request->user()
            ]);
        });

        // Rute za zdravstvene kartone
        Route::get("/medical-records", [MedicalRecordController::class, "index"]);
        Route::get("/medical-records/{id}", [MedicalRecordController::class, "show"]);
        Route::put("/medical-records/{id}", [MedicalRecordController::class, "update"]);

        // Rute za preglede
        Route::post("/examinations", [ExaminationController::class, "store"]);
        Route::get("/examinations", [ExaminationController::class, "index"]);
        Route::put("/examinations/{id}", [ExaminationController::class, "update"]);
        Route::get("/appointments/doctor/{doctorId}", [AppointmentController::class, "byDoctor"]);

        // Rute za pacijente
        Route::get("/patients", [PatientController::class, "index"]);
        Route::get("/patients/{id}", [PatientController::class, "show"]);
        Route::post("/patients", [PatientController::class, "store"]);
        Route::put("/patients/{id}", [PatientController::class, "updatePatient"]);
        Route::delete("/patients/{id}", [PatientController::class, "deletePatient"]);
        //Rute za doktore
        Route::get("/doctors", [DoctorController::class, "index"]);
        Route::post("/doctors", [DoctorController::class, "store"]);
    });
});
