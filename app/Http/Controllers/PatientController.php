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
   public function index(Request $request)
    {
        $user = Auth::user();
        $search = $request->query('search');
        $perPage = $request->query('per_page', 8); // default 8

        if ($user->isAdmin()) {
            $patients = Patient::with('user', 'medicalRecord.doctor.user')
                ->when($search, function ($query, $search) {
                    $query->whereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', $search . '%');
                    });
                })
                ->paginate($perPage);

            return $patients;
        }

        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            $patients = Patient::whereHas('medicalRecord', function ($query) use ($doctor) {
                    $query->where('doctor_id', $doctor->id);
                })
                ->with('user', 'medicalRecord')
                ->when($search, function ($query, $search) {
                    $query->whereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', $search . '%');
                    });
                })
                ->paginate($perPage);

            return $patients; // 👈 isto
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

        return $patient;
    }

    // Kreiranje novog pacijenta (samo admin)
   public function store(Request $request)
{
    $authUser = Auth::user();

    if (!$authUser || !in_array($authUser->role, ['admin', 'doctor'])) {
        return response()->json([
            'success' => false,
            'message' => 'Samo administrator ili doktor mogu kreirati pacijente'
        ], 403);
    }

    $validator = Validator::make($request->all(), [
        'name'          => 'required|string|max:255',
        'email'         => 'required|email|unique:users,email',
        'password'      => 'required|string|min:8',
        'jmbg'          => 'required|string|size:13|unique:patients,jmbg',
        'date_of_birth' => 'required|date',
        'gender'        => 'required|in:male,female,other',
        'doctor_id'     => 'nullable|exists:doctors,id',
        'blood_type'    => 'required_with:doctor_id|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors'  => $validator->errors()
        ], 422);
    }

    $user = \App\Models\User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => bcrypt($request->password),
        'role'     => 'patient',
    ]);

    $patient = \App\Models\Patient::create([
        'user_id'       => $user->id,
        'jmbg'          => $request->jmbg,
        'date_of_birth' => $request->date_of_birth,
        'gender'        => $request->gender,
    ]);

    $medicalRecord = null;
    if ($request->has('doctor_id')) {
        $medicalRecord = \App\Models\MedicalRecord::create([
            'patient_id'       => $patient->id,
            'doctor_id'        => $request->doctor_id,
            'blood_type'       => $request->blood_type,
            'allergies'        => '',
            'chronic_diseases' => '',
            'opening_date'     => now()->format('Y-m-d'),
            'notes'            => '',
        ]);
    }

    return response()->json([
        'success' => true,
        'data'    => $patient->load('user')->loadMissing('medicalRecord.doctor.user'),
        'message' => 'Pacijent uspešno kreiran' . ($medicalRecord ? ' sa kartonom' : ''),
    ], 201);
}


        return response()->json([
            'success' => true,
            'data'    => $patient->load('user')
                                ->loadMissing('medicalRecord.doctor.user'),
            'message' => 'Pacijent uspešno kreiran' . ($medicalRecord ? ' sa kartonom' : ''),
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
    public function deletePatient($id)
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
    public function getPatientsByDoctor(Request $request)
    {
        $user = Auth::user();
        $searchDoctorName = $request->query('doctor_name'); // ?doctor_name=Camden
        $perPage = $request->query('per_page', 8);

        $query = Patient::with(['user', 'medicalRecord.doctor.user'])
            ->when($searchDoctorName, function ($q) use ($searchDoctorName) {
                $q->whereHas('medicalRecord.doctor.user', function ($sub) use ($searchDoctorName) {
                    $sub->where('name', 'like', $searchDoctorName . '%'); // 👈 samo početak imena
                });
            });


        if ($user->isAdmin()) {
            return response()->json([
                'success' => true,
                'data' => $query->paginate($perPage)
            ]);
        }

        if ($user->isDoctor()) {
            $patients = $query->whereHas('medicalRecord', function ($q) use ($user) {
                $q->where('doctor_id', $user->doctorProfile->id);
            })->paginate($perPage);

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


}