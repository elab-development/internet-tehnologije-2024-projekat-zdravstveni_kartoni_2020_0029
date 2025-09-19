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
    Route::post("/register", [RegisterController::class, "register"])->withoutMiddleware(["api"]);
    Route::post('/patients/register', [PatientController::class, 'store'])->withoutMiddleware(["api"]);
    Route::get("/doctors", [DoctorController::class, "index"])->withoutMiddleware(["api"]);

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
        Route::get('/patients/{patientId}/medical-record-id',[MedicalRecordController::class, 'getByPatientId']
);

        // Rute za preglede
        Route::post("/examinations", [ExaminationController::class, "store"]);
        Route::get("/examinations", [ExaminationController::class, "index"]);
        Route::get('/medical-records/{medicalRecordId}/examinations', [ExaminationController::class, 'getByMedicalRecord']);
        Route::put("/examinations/{id}", [ExaminationController::class, "updateExamination"]);
        Route::delete('/examinations/{id}', [ExaminationController::class, 'deleteExamination']);


        //Rute za zakazane tremine
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::put('/appointments/{id}', [AppointmentController::class, 'updateStatus']);
        Route::delete('/appointments/{id}', [AppointmentController::class, 'deleteAppointment']);

        // Rute za pacijente
        Route::get("/patients", [PatientController::class, "index"]);
        Route::get('/patients/by-doctor', [PatientController::class, 'getPatientsByDoctor']);
        Route::get("/patients/{id}", [PatientController::class, "show"]);
        Route::post("/patients", [PatientController::class, "store"]);
        Route::put("/patients/{id}", [PatientController::class, "updatePatient"]);
        Route::delete("/patients/{id}", [PatientController::class, "deletePatient"]);


        //Rute za doktore
       // Route::get("/doctors", [DoctorController::class, "index"]);
        Route::post("/doctors", [DoctorController::class, "store"]);
        Route::delete('/doctors/{id}', [DoctorController::class, 'deleteDoctor']);
        Route::put('/doctors/{id}', [DoctorController::class, 'updateDoctor']);
        Route::put('/doctors/{id}/password', [DoctorController::class, 'updateDoctorPassword']);

    });
});
