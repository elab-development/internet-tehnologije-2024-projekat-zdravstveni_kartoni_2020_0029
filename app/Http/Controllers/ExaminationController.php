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
            'medical_record_id'     => 'required|exists:medical_records,id',
            'symptom_description'   => 'required|string|max:1000',
            'diagnosis'             => 'required|string|max:500',
            'therapy'               => 'required|string|max:500',
        ]);

        $medicalRecord = MedicalRecord::findOrFail($validated['medical_record_id']);

        // Ako je doktor → dozvoli kreiranje pregleda samo njemu
        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            if (!$doctor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate profil lekara'
                ], 403);
            }
        }

        // Ako je admin → koristi doctor_id iz kartona
        $doctorId = $user->isDoctor() ? $user->doctorProfile->id : $medicalRecord->doctor_id;

        $examination = Examination::create([
            'medical_record_id'     => $medicalRecord->id,
            'doctor_id'             => $doctorId,
            'symptom_description'   => $validated['symptom_description'],
            'examination_date'      => now(),
            'diagnosis'             => $validated['diagnosis'],
            'therapy'               => $validated['therapy'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $examination->load(['medicalRecord.patient.user', 'doctors.user'])
        ], 201);
    }

    /**
     * Lista pregleda
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Examination::query();

        // 🔹 Filtriranje po kartonu
        if ($request->has('medical_record_id')) {
            $query->where('medical_record_id', $request->medical_record_id);
        }

        // 🔹 Ograničenja po ulozi
        if ($user->isPatient()) {
            $patient = $user->patientProfile;
            $query->whereHas('medicalRecord', function($q) use ($patient) {
                $q->where('patient_id', $patient->id);
            });
        } elseif ($user->isDoctor()) {
            $query->where('doctor_id', $user->doctorProfile->id);
        } elseif ($user->isAdmin()) {
            // admin vidi sve
        } else {
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

        $examinations = $query->with(['medicalRecord.patient.user', 'doctors.user'])
                              ->paginate($request->get('per_page', 8));

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
        $examination = Examination::with(['medicalRecord.patient.user', 'doctors.user'])->findOrFail($id);
        $user = Auth::user();

        // Pacijent može videti samo svoje preglede
        if ($user->isPatient() && $examination->medicalRecord->patient_id !== $user->patientProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate pristup ovom pregledu'
            ], 403);
        }

        // Doktor može videti samo svoje preglede
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

        $validated = $request->validate([
            'symptom_description' => 'sometimes|string|max:1000',
            'diagnosis'           => 'sometimes|string|max:500',
            'therapy'             => 'sometimes|string|max:500',
        ]);

        $examination->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $examination->fresh(['medicalRecord.patient.user', 'doctors.user']),
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

        if ($user->isDoctor() && $examination->doctor_id !== $user->doctorProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za brisanje ovog pregleda'
            ], 403);
        }

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

    /**
     * Pregledi po kartonu
     */
    public function getByMedicalRecord($medicalRecordId, Request $request)
    {
        $user = Auth::user();
        $medicalRecord = MedicalRecord::with('patient')->find($medicalRecordId);

        if (!$medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Karton nije pronađen'
            ], 404);
        }

        $query = Examination::where('medical_record_id', $medicalRecordId)
            ->with(['medicalRecord.patient.user', 'doctors.user']);

        // Pacijent vidi samo svoj karton
        if ($user->isPatient()) {
            $patient = $user->patientProfile;
            if (!$patient || $patient->id !== $medicalRecord->patient_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom kartonu'
                ], 403);
            }
        }

        // Doktor vidi samo preglede koje je on uradio
        if ($user->isDoctor()) {
            $doctorId = $user->doctorProfile->id ?? null;
            $query->where('doctor_id', $doctorId);
        }

        // Sortiranje
        $sort = $request->get('sort', 'examination_date');
        $direction = $request->get('direction', 'desc');
        $query->orderBy($sort, $direction);

        $examinations = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $examinations
        ]);
    }
}
