<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Enums\UserRole;
use App\Enums\BloodType;    
use App\Enums\Gender;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // Validacija
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:'.implode(',', [UserRole::PATIENT->value, UserRole::DOCTOR->value]),
            // Pacijent specifična polja
            'jmbg' => 'required_if:role,patient|string|size:13|unique:patients',
            'date_of_birth' => 'required_if:role,patient|date',
            'gender' => ['required_if:role,patient', 'string', 'in:'.implode(',', array_column(Gender::cases(), 'value'))],
            'doctor_id' => 'required_if:role,patient|exists:doctors,id',
            'blood_type' => ['required_if:role,patient', 'string', 'in:'.implode(',', BloodType::values())],
            // Doktor specifična polja
            'specialization' => 'required_if:role,doctor|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Kreiranje korisnika
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Kreiranje profila
        if ($request->role === UserRole::PATIENT->value) {
            $patient = Patient::create([
                'user_id' => $user->id,
                'jmbg' => $request->jmbg,
                'date_of_birth' => $request->date_of_birth,
                'gender' => $request->gender,
            ]);

            // Kreiranje zdravstvenog kartona
            $medicalRecord = MedicalRecord::create([
                'patient_id' => $patient->id,
                'doctor_id' => $request->doctor_id,
                'blood_type' => $request->blood_type,
                'opening_date' => now(),
                'allergies' => $request->allergies ?? null,
                'chronic_diseases' => $request->chronic_diseases ?? null,
            ]);
        } else {
            $doctor = Doctor::create([
                'user_id' => $user->id,
                'specialization' => $request->specialization,
                'description' => $request->description ?? null,
            ]);
        }

        // Logovanje korisnika i generisanje tokena
        Auth::login($user);
        $token = $this->createAuthToken($user);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->only(['id', 'name', 'email', 'role']),
                'token' => $token,
                'redirect_to' => $this->getDashboardRoute($user->role),
                'expires_in' => 28800 // 8 sati u sekundama
            ]
        ], 201);
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

    // Metoda za dobavljanje doktora (korisno za frontend)
    public function getDoctors()
    {
        $doctors = Doctor::with('user')->get();
        return response()->json($doctors);
    }
}