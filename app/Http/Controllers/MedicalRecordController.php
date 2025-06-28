<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MedicalRecordController extends Controller
{
    // Prikaz svih zdravstvenih kartona za lekara (samo njegovih)
    public function index()
    {
        $user = Auth::user();
        
        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            $medicalRecords = $doctor->medicalRecords()->with('patient.user')->get();
            
            return response()->json([
                'success' => true,
                'data' => $medicalRecords
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'Samo lekar može pristupiti listi zdravstvenih kartona'
        ], 403);
    }

    // Prikaz pojedinačnog zdravstvenog kartona
    public function show($id)
    {
        $medicalRecord = MedicalRecord::with(['examinations', 'doctor.user', 'patient.user'])->find($id);
        $user = Auth::user();

        if (!$medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Zdravstveni karton nije pronađen'
            ], 404);
        }

        // Provera pristupa
        if ($user->isPatient()) {
            $patient = $user->patientProfile;
            if ($medicalRecord->patient_id !== $patient->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom zdravstvenom kartonu'
                ], 403);
            }
        } 
        elseif ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            if ($medicalRecord->doctor_id !== $doctor->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom zdravstvenom kartonu'
                ], 403);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $medicalRecord
        ]);
    }

    // Pacijent menja lekara
    public function changeDoctor(Request $request, $id)
    {
        $medicalRecord = MedicalRecord::find($id);
        $user = Auth::user();

        if (!$medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Zdravstveni karton nije pronađen'
            ], 404);
        }

        // Samo pacijent može promeniti lekara
        if (!$user->isPatient()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo pacijent može promeniti lekara'
            ], 403);
        }

        $patient = $user->patientProfile;
        if ($medicalRecord->patient_id !== $patient->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za izmenu ovog kartona'
            ], 403);
        }

        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id'
        ]);

        $medicalRecord->update(['doctor_id' => $validated['doctor_id']]);

        return response()->json([
            'success' => true,
            'message' => 'Lekar je uspešno promenjen',
            'data' => $medicalRecord
        ]);
    }

    // Ažuriranje zdravstvenog kartona (samo lekar)
    public function updateMedicalRecord(Request $request, $id)
    {
        $medicalRecord = MedicalRecord::find($id);
        $user = Auth::user();

        if (!$medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Zdravstveni karton nije pronađen'
            ], 404);
        }

        // Provera ovlašćenja - samo lekar koji je dodeljen kartonu
        if (!$user->isDoctor()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo lekar može ažurirati zdravstveni karton'
            ], 403);
        }

        $doctor = $user->doctorProfile;
        if ($medicalRecord->doctor_id !== $doctor->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za izmenu ovog kartona'
            ], 403);
        }

        $validated = $request->validate([
            'blood_type' => 'sometimes|string',
            'allergies' => 'sometimes|array',
            'chronic_diseases' => 'sometimes|array',
            'notes' => 'sometimes|string',
        ]);

        $medicalRecord->update($validated);

        return response()->json([
            'success' => true,
            'data' => $medicalRecord
        ]);
    }
}