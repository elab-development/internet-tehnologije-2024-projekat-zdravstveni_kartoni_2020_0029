<?php

namespace App\Http\Controllers;

use App\Models\Examination;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExaminationController extends Controller
{
    /**
     * Kreiranje novog pregleda
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        // ✅ Dozvoli doktorima i adminima
        if (!$user->isDoctor() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo lekar ili administrator mogu kreirati pregled'
            ], 403);
        }

        $validated = $request->validate([
            'medical_record_id' => 'required|exists:medical_records,id',
            'symptom_description' => 'required|string|max:1000',
            'diagnosis' => 'required|string|max:500',
            'therapy' => 'required|string|max:500',
        ]);

        $medicalRecord = MedicalRecord::findOrFail($validated['medical_record_id']);

        // Ako je doktor → proveri da li karton pripada njemu
        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            if ($medicalRecord->doctor_id !== $doctor->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom zdravstvenom kartonu'
                ], 403);
            }
        }

        // Ako je admin → samo koristi podatke iz kartona
        $doctorId = $user->isDoctor() ? $user->doctorProfile->id : $medicalRecord->doctor_id;
        $doctorName = $user->isDoctor() ? $user->name : $medicalRecord->doctor->user->name;

        $examination = Examination::create([
            'medical_record_id' => $medicalRecord->id,
            'doctor_id' => $doctorId,
            'doctor_name' => $doctorName,
            'symptom_description' => $validated['symptom_description'],
            'examination_date' => now(),
            'diagnosis' => $validated['diagnosis'],
            'therapy' => $validated['therapy'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $examination->load('medicalRecord.patient.user')
        ], 201);
    }


    /**
     * Prikaz pregleda - za pacijenta (samo njegove) ili lekara (samo njegove)
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Examination::query();

        // 🔹 Filtriranje po medical_record_id
        if ($request->has('medical_record_id')) {
            $query->where('medical_record_id', $request->medical_record_id);
        }

        // 🔹 Ograničenja po ulozi
        if ($user->isPatient()) {
            $patient = $user->patientProfile;
            $query->whereHas('medicalRecord', function($q) use ($patient) {
                $q->where('patient_id', $patient->id);
            });
        } 
        elseif ($user->isDoctor()) {
            $query->where('doctor_id', $user->doctorProfile->id);
        } 
        elseif ($user->isAdmin()) {
            // admin vidi sve, ali i dalje može koristiti filter
        } 
        else {
            return response()->json([
                'success' => false,
                'message' => 'Nemate pristup pregledima'
            ], 403);
        }

        // 🔹 Filtriranje po datumu
        if ($request->has('date_from')) {
            $query->where('examination_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('examination_date', '<=', $request->date_to);
        }

        // 🔹 Sortiranje
        $sort = $request->get('sort', 'examination_date');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($sort, $direction);

        $examinations = $query->with(['medicalRecord.patient.user'])
                            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $examinations
        ]);
    }



    /**
     * Prikaz pojedinačnog pregleda
     */
    public function show($id)
    {
        $examination = Examination::with(['medicalRecord.patient.user'])->findOrFail($id);
        $user = Auth::user();

        // Provera ovlašćenja
        if ($user->isPatient() && $examination->medicalRecord->patient_id !== $user->patientProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate pristup ovom pregledu'
            ], 403);
        }

        if ($user->isDoctor() && $examination->doctor_id !== $user->doctorProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate pristup ovom pregledu'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $examination
        ]);
    }

    /**
     * Ažuriranje pregleda
     */
    public function updateExamination(Request $request, $id)
    {
        $examination = Examination::findOrFail($id);
        $user = Auth::user();

        if ($user->isDoctor()) {
            if (!$user->doctorProfile || $examination->doctor_id !== $user->doctorProfile->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate ovlašćenje za izmenu ovog pregleda'
                ], 403);
            }
        }

        if (!$user->isAdmin() && !$user->isDoctor()) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za izmenu ovog pregleda'
            ], 403);
        }

        // ✅ Validacija unosa
        $validated = $request->validate([
            'symptom_description' => 'sometimes|string|max:1000',
            'diagnosis'           => 'sometimes|string|max:500',
            'therapy'             => 'sometimes|string|max:500',
        ]);

        // ✅ Update pregleda
        $examination->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $examination->fresh(['medicalRecord.patient.user']),
            'message' => 'Pregled uspešno izmenjen'
        ]);
    }


    /**
     * Brisanje pregleda
     */
    public function deleteExamination($id)
    {
        $examination = Examination::findOrFail($id);
        $user = Auth::user();

        // Ako je doktor, mora da bude vlasnik pregleda
        if ($user->isDoctor() && $examination->doctor_id !== $user->doctorProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za brisanje ovog pregleda'
            ], 403);
        }

        // Admin može sve
        if ($user->isAdmin() || $user->isDoctor()) {
            $examination->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pregled uspešno obrisan'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Nemate ovlašćenje za ovu akciju'
        ], 403);
    }

    public function getByMedicalRecord($medicalRecordId, Request $request)
    {
        $user = Auth::user();

        // Pronađi karton
        $medicalRecord = \App\Models\MedicalRecord::with('patient')->find($medicalRecordId);

        if (!$medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Karton nije pronađen'
            ], 404);
        }

        // 🔒 Provera pristupa
        if ($user->isPatient()) {
            $patient = $user->patientProfile;
            if (!$patient || $patient->id !== $medicalRecord->patient_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom kartonu'
                ], 403);
            }
        }

        if ($user->isDoctor()) {
            $doctorId = $user->doctorProfile->id ?? null;
            if (!$doctorId || $doctorId !== $medicalRecord->doctor_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom kartonu'
                ], 403);
            }
        }

        // Tek ovde pravi query za preglede
        $query = Examination::where('medical_record_id', $medicalRecordId)
            ->with(['medicalRecord.patient.user']);

        // sortiranje
        $sort = $request->get('sort', 'examination_date');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($sort, $direction);

        // paginacija
        $examinations = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $examinations
        ]);
    }



}