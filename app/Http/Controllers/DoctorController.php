<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MedicalRecord;

class DoctorController extends Controller
{
    // Prikaz svih doktora (dostupno svima)
    public function index(Request $request)
    {
         // Osnovni upit sa eager loading
        $query = Doctor::with(['user:id,name,email']);
        
        // Filtriranje po specijalizaciji (ako je prosleđeno)
        if ($request->filled('specialization')) {
            $specialization = $request->get('specialization');
            $query->where('specialization', 'like', '%' . $specialization . '%');
        }

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', $search . '%');
            });
        }
        
        // Sortiranje (default po imenu doktora)
        $sort = $request->get('sort', 'user.name');
        $direction = $request->get('direction', 'asc');
        
        if ($sort === 'specialization') {
            $query->orderBy('specialization', $direction);
        } else {
            $query->join('users', 'users.id', '=', 'doctors.user_id')
                 ->orderBy('users.name', $direction)
                 ->select('doctors.*');
        }
        
        $doctors = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $doctors,
            'message' => 'Lista doktora'
        ]);
    }

    // Prikaz pojedinačnog doktora (dostupno svima)
    public function show($id)
    {
       $doctor = Doctor::with(['user:id,name,email,phone,address', 
                              'medicalRecords' => function($query) {
                                  $query->select('id', 'patient_id', 'doctor_id', 'opening_date')
                                        ->with(['patient.user:id,name']);
                              }])
                       ->findOrFail($id, ['id', 'user_id', 'specialization', 'description']);

        // Formatiranje podataka za frontend
        $formattedDoctor = [
            'id' => $doctor->id,
            'name' => $doctor->user->name,
            'email' => $doctor->user->email,
            'phone' => $doctor->user->phone,
            'address' => $doctor->user->address,
            'specialization' => $doctor->specialization,
            'description' => $doctor->description,
            'patient_count' => $doctor->medicalRecords->count(),
            'years_experience' => $this->calculateExperience($doctor->created_at),
        ];

        return response()->json([
            'success' => true,
            'data' => $formattedDoctor,
            'message' => 'Detalji o doktoru'
        ]);
    }

    /**
     * Kreiranje novog doktora (samo admin)
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može kreirati doktora'
            ], 403);
        }

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|email|max:255|unique:users,email',
            'password'       => 'required|string|min:6',
            'specialization' => 'required|string|max:255',
            'description'    => 'nullable|string',
        ]);

        // 1. Kreiraj user-a
        $newUser = \App\Models\User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => bcrypt($validated['password']), // enkripcija lozinke
            'role'     => 'doctor',
        ]);

        // 2. Kreiraj doktora vezanog za user-a
        $doctor = \App\Models\Doctor::create([
            'user_id'       => $newUser->id,
            'specialization'=> $validated['specialization'],
            'description'   => $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $doctor->load('user:id,name,email,role'),
            'message' => 'Doktor i korisnik uspešno kreirani'
        ], 201);
    }


    // Ažuriranje doktora (samo admin ili sam lekar)
    public function updateDoctor(Request $request, $id)
{
    $doctor = Doctor::find($id);
    $user = Auth::user();

    if (!$doctor) {
        return response()->json([
            'success' => false,
            'message' => 'Doktor nije pronađen'
        ], 404);
    }

    // Dozvoli adminu sve izmene, ali običnom korisniku samo nad svojim doktorom
    if (!$user->isAdmin() && $user->id !== $doctor->user_id) {
        return response()->json([
            'success' => false,
            'message' => 'Nemate ovlašćenje za izmenu ovog doktora'
        ], 403);
    }

    // Validacija za doktora
    $doctorData = $request->only(['specialization', 'description']);
    $validatedDoctorData = validator($doctorData, [
        'specialization' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
    ])->validate();

    $doctor->update($validatedDoctorData);

    // Validacija za korisnika (ako su poslati)
    $userData = $request->only(['name', 'email']);
    if (!empty($userData)) {
        $validatedUserData = validator($userData, [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
        ])->validate();

        $doctor->user()->update($validatedUserData);
    }

    return response()->json([
        'success' => true,
        'data' => $doctor->load('user')
    ]);
}


    // Brisanje doktora (samo admin)
    public function deleteDoctor(Request $request, $id)
    {
        $doctor = Doctor::find($id);
        $user = Auth::user();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doktor nije pronađen'
            ], 404);
        }

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može obrisati doktora'
            ], 403);
        }

        // Pre brisanja doktora prebaciti sve njegove kartone na drugog doktora
        $newDoctorId = $request->input('new_doctor_id');
        if (!$newDoctorId || !Doctor::find($newDoctorId)) {
            return response()->json([
                'success' => false,
                'message' => 'Morate odrediti validnog doktora za preuzimanje kartona'
            ], 400);
        }

        // Prebacivanje zdravstvenih kartona na novog doktora
        MedicalRecord::where('doctor_id', $doctor->id)
            ->update(['doctor_id' => $newDoctorId]);

        // Brisanje doktora i korisničkog naloga
        $userId = $doctor->user_id;
        $doctor->delete();
        User::destroy($userId);

        return response()->json([
            'success' => true,
            'message' => 'Doktor je uspešno obrisan'
        ]);
    }

    // Prikaz pacijenata za doktora
    public function myPatients()
    {
        $user = Auth::user();

        if (!$user->isDoctor()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo lekar može pristupiti svojim pacijentima'
            ], 403);
        }

        $doctor = $user->doctorProfile;
        $patients = MedicalRecord::where('doctor_id', $doctor->id)
            ->with('patient.user')
            ->get()
            ->pluck('patient');

        return response()->json([
            'success' => true,
            'data' => $patients
        ]);
    }
}