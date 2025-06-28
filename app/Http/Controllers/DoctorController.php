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
        if ($request->has('specialization')) {
            $query->where('specialization', 'like', '%'.$request->specialization.'%');
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
            'user_id' => 'required|exists:users,id|unique:doctors,user_id',
            'specialization' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $doctor = Doctor::create($validated);

        return response()->json([
            'success' => true,
            'data' => $doctor->load('user:id,name,email'),
            'message' => 'Doktor uspešno kreiran'
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

        if (!$user->isAdmin() && $user->id !== $doctor->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za izmenu ovog doktora'
            ], 403);
        }

        $validated = $request->validate([
            'specialization' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|nullable',
        ]);

        $doctor->update($validated);

        // Ažuriranje osnovnih korisničkih podataka ako su poslati
        if ($request->has('name') || $request->has('email')) {
            $userData = $request->only(['name', 'email']);
            $doctor->user()->update($userData);
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