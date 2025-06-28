<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    // Prikaz svih pacijenata (za admina) ili pacijenata lekara
    public function index()
    {
        $user = Auth::user();
        
        if ($user->isAdmin()) {
            $patients = Patient::with('user', 'medicalRecord.doctor.user')->get();
            
            return response()->json([
                'success' => true,
                'data' => $patients
            ]);
        }
        
        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            $patients = Patient::whereHas('medicalRecord', function($query) use ($doctor) {
                $query->where('doctor_id', $doctor->id);
            })->with('user', 'medicalRecord')->get();
            
            return response()->json([
                'success' => true,
                'data' => $patients
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Nemate ovlašćenje za pristup listi pacijenata'
        ], 403);
    }

    // Prikaz pojedinačnog pacijenta
    public function show($id)
    {
        $patient = Patient::with(['user', 'medicalRecord.doctor.user'])->find($id);
        $user = Auth::user();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Pacijent nije pronađen'
            ], 404);
        }

        // Provera pristupa
        if ($user->isPatient() && $user->id !== $patient->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate pristup ovom pacijentu'
            ], 403);
        }

        // Lekar može videti samo svoje pacijente
        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            if (!$patient->medicalRecord || $patient->medicalRecord->doctor_id !== $doctor->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom pacijentu'
                ], 403);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $patient
        ]);
    }

    // Kreiranje novog pacijenta (samo admin)
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može kreirati pacijente'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'jmbg' => 'required|string|size:13|unique:patients,jmbg',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female,other',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Kreiranje korisnika
        $userData = $request->only(['name', 'email', 'password']);
        $userData['role'] = User::ROLE['PATIENT'];
        $user = User::create($userData);

        // Kreiranje pacijenta
        $patientData = $request->only(['jmbg', 'date_of_birth', 'gender']);
        $patientData['user_id'] = $user->id;
        $patient = Patient::create($patientData);

        return response()->json([
            'success' => true,
            'data' => $patient->load('user')
        ], 201);
    }

    // Ažuriranje pacijenta
    public function updatePatient(Request $request, $id)
    {
        $patient = Patient::find($id);
        $user = Auth::user();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Pacijent nije pronađen'
            ], 404);
        }

        // Provera ovlašćenja
        if ($user->isPatient() && $user->id !== $patient->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za izmenu ovog pacijenta'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,'.$patient->user_id,
            'jmbg' => 'sometimes|string|size:13|unique:patients,jmbg,'.$id,
            'date_of_birth' => 'sometimes|date',
            'gender' => 'sometimes|in:male,female,other',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Ažuriranje korisničkih podataka
        if ($request->has('name') || $request->has('email')) {
            $userData = $request->only(['name', 'email']);
            $patient->user()->update($userData);
        }

        // Ažuriranje podataka pacijenta
        $patientData = $request->only(['jmbg', 'date_of_birth', 'gender']);
        $patient->update($patientData);

        return response()->json([
            'success' => true,
            'data' => $patient->load('user')
        ]);
    }

    // Brisanje pacijenta (samo admin)
    public function destroy($id)
    {
        $patient = Patient::find($id);
        $user = Auth::user();

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Pacijent nije pronađen'
            ], 404);
        }

        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može obrisati pacijenta'
            ], 403);
        }

        // Brisanje povezanih podataka
        if ($patient->medicalRecord) {
            $patient->medicalRecord->examinations()->delete();
            $patient->medicalRecord()->delete();
        }

        // Brisanje korisničkog naloga
        $userId = $patient->user_id;
        $patient->delete();
        User::destroy($userId);

        return response()->json([
            'success' => true,
            'message' => 'Pacijent je uspešno obrisan'
        ]);
    }

    // Metoda za dobijanje pacijenata određenog lekara
    public function getPatientsByDoctor($doctorId)
    {
        $user = Auth::user();
        
        // Samo admin ili lekar koji proverava svoje pacijente
        if ($user->isAdmin() || ($user->isDoctor() && $user->doctorProfile->id == $doctorId)) {
            $patients = Patient::whereHas('medicalRecord', function($query) use ($doctorId) {
                $query->where('doctor_id', $doctorId);
            })->with('user', 'medicalRecord')->get();
            
            return response()->json([
                'success' => true,
                'data' => $patients
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Nemate ovlašćenje za pristup ovoj listi pacijenata'
        ], 403);
    }
}