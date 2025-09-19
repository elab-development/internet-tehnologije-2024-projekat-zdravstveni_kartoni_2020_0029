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
    // 📌 Prikaz svih pacijenata
    public function index(Request $request)
    {
        $user = Auth::user();
        $search = $request->query('search');
        $perPage = $request->query('per_page', 8);

        // ADMIN → svi pacijenti
        if ($user->isAdmin()) {
            $patients = Patient::with('user', 'medicalRecord.doctor.user')
                ->when($search, fn($query) =>
                    $query->whereHas('user', fn($q) =>
                        $q->where('name', 'like', $search . '%')
                    )
                )
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $patients
            ]);
        }

        // DOCTOR → samo njegovi pacijenti
        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;

            $patients = Patient::whereHas('medicalRecord', fn($query) =>
                    $query->where('doctor_id', $doctor->id)
                )
                ->with('user', 'medicalRecord.doctor.user')
                ->when($search, fn($query) =>
                    $query->whereHas('user', fn($q) =>
                        $q->where('name', 'like', $search . '%')
                    )
                )
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $patients
            ]);
        }

        // NURSE → samo pacijenti vezani za sestru
        if ($user->isNurse()) {
            $nurse = $user->nurseProfile;

            $patients = Patient::whereHas('medicalRecord', fn($query) =>
                    $query->where('nurse_id', $nurse->id)
                )
                ->with('user', 'medicalRecord.doctor.user')
                ->when($search, fn($query) =>
                    $query->whereHas('user', fn($q) =>
                        $q->where('name', 'like', $search . '%')
                    )
                )
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $patients
            ]);
        }

        // PATIENT → samo svoj nalog
        if ($user->isPatient()) {
            $patient = $user->patientProfile;

            $patients = Patient::where('id', $patient->id)
                ->with('user', 'medicalRecord.doctor.user')
                ->paginate(1);

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


    // 📌 Prikaz pojedinačnog pacijenta
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

        if ($user->isPatient() && $user->id !== $patient->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate pristup ovom pacijentu'
            ], 403);
        }

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

    // 📌 Kreiranje pacijenta (self-registration ili admin/doktor)
    public function store(Request $request)
    {
        $authUser = Auth::user();

        // 🔹 Self-registration (nema Auth user-a)
        if (!$authUser) {
            $validator = Validator::make($request->all(), [
                'name'          => 'required|string|max:255',
                'email'         => 'required|email|unique:users,email',
                'password'      => 'required|string|min:8',
                'jmbg'          => 'required|string|size:13|unique:patients,jmbg',
                'date_of_birth' => 'required|date',
                'gender'        => 'required|in:male,female,other',
                'doctor_id'     => 'nullable|exists:doctors,id',
                'blood_type'    => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors'  => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => bcrypt($request->password),
                'role'     => 'patient',
            ]);

            $patient = Patient::create([
                'user_id'       => $user->id,
                'jmbg'          => $request->jmbg,
                'date_of_birth' => $request->date_of_birth,
                'gender'        => $request->gender,
            ]);

            $medicalRecord = null;
            if ($request->filled('doctor_id') || $request->filled('blood_type')) {
                $medicalRecord = MedicalRecord::create([
                    'patient_id'   => $patient->id,
                    'doctor_id'    => $request->doctor_id,
                    'blood_type'   => $request->blood_type,
                    'opening_date' => now(),
                ]);
            }

            return response()->json([
                'success' => true,
                'data'    => $patient->load('user')->loadMissing('medicalRecord.doctor.user'),
                'message' => 'Pacijent uspešno registrovan' . ($medicalRecord ? ' sa kartonom' : ''),
            ], 201);
        }

        // 🔹 Ako je Auth user → samo admin ili doktor
        if (!in_array($authUser->role, ['admin', 'doctor'])) {
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

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'role'     => 'patient',
        ]);

        $patient = Patient::create([
            'user_id'       => $user->id,
            'jmbg'          => $request->jmbg,
            'date_of_birth' => $request->date_of_birth,
            'gender'        => $request->gender,
        ]);

        $medicalRecord = null;
        if ($request->filled('doctor_id')) {
            $medicalRecord = MedicalRecord::create([
                'patient_id'       => $patient->id,
                'doctor_id'        => $request->doctor_id,
                'blood_type'       => $request->blood_type,
                'allergies'        => null,
                'chronic_diseases' => null,
                'opening_date'     => now()->format('Y-m-d'),
                'notes'            => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data'    => $patient->load('user')->loadMissing('medicalRecord.doctor.user'),
            'message' => 'Pacijent uspešno kreiran' . ($medicalRecord ? ' sa kartonom' : ''),
        ], 201);
    }

    // 📌 Update pacijenta
    public function updatePatient(Request $request, $id)
    {
        $patient = Patient::find($id);
        $user = Auth::user();

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Pacijent nije pronađen'], 404);
        }

        if ($user->isPatient() && $user->id !== $patient->user_id) {
            return response()->json(['success' => false, 'message' => 'Nemate ovlašćenje'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $patient->user_id,
            'jmbg' => 'sometimes|string|size:13|unique:patients,jmbg,' . $id,
            'date_of_birth' => 'sometimes|date',
            'gender' => 'sometimes|in:male,female,other',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        if ($request->has('name') || $request->has('email')) {
            $patient->user()->update($request->only(['name', 'email']));
        }

        $patient->update($request->only(['jmbg', 'date_of_birth', 'gender']));

        return response()->json(['success' => true, 'data' => $patient->load('user')]);
    }

    // 📌 Brisanje pacijenta
    public function deletePatient($id)
    {
        $patient = Patient::find($id);
        $user = Auth::user();

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Pacijent nije pronađen'], 404);
        }

        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Samo administrator može obrisati pacijenta'], 403);
        }

        if ($patient->medicalRecord) {
            $patient->medicalRecord->examinations()->delete();
            $patient->medicalRecord()->delete();
        }

        $userId = $patient->user_id;
        $patient->delete();
        User::destroy($userId);

        return response()->json(['success' => true, 'message' => 'Pacijent je uspešno obrisan']);
    }

    // 📌 Pacijenti određenog lekara
    public function getPatientsByDoctor(Request $request)
    {
        $user = Auth::user();
        $searchDoctorName = $request->query('doctor_name');
        $perPage = $request->query('per_page', 8);

        $query = Patient::with(['user', 'medicalRecord.doctor.user'])
            ->when($searchDoctorName, fn($q) =>
                $q->whereHas('medicalRecord.doctor.user', fn($sub) =>
                    $sub->where('name', 'like', '%' . $searchDoctorName . '%')
                )
            );

        if ($user->isAdmin()) {
            return response()->json(['success' => true, 'data' => $query->paginate($perPage)]);
        }

        if ($user->isDoctor()) {
            $doctorId = optional($user->doctorProfile)->id;

            if (!$doctorId) {
                return response()->json(['success' => false, 'message' => 'Doktor nema profil'], 400);
            }

            $patients = $query->whereHas('medicalRecord', fn($q) => $q->where('doctor_id', $doctorId))
                              ->paginate($perPage);

            return response()->json(['success' => true, 'data' => $patients]);
        }

        return response()->json(['success' => false, 'message' => 'Nemate ovlašćenje'], 403);
    }
}
