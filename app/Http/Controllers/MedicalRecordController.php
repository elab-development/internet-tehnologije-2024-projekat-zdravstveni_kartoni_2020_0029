<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MedicalRecordController extends Controller
{
    // 📌 Prikaz svih zdravstvenih kartona za lekara
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

    // 📌 Prikaz pojedinačnog kartona
    public function show($medicalRecordId = null)
    {
        $user = Auth::user();

        if ($user->isPatient() && !$medicalRecordId) {
            $patient = $user->patientProfile;
            $medicalRecord = MedicalRecord::with(['patient.user','doctor.user','examinations'])
                ->where('patient_id', optional($patient)->id)
                ->first();

            if (!$medicalRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate zdravstveni karton'
                ], 404);
            }

            return response()->json(['success' => true, 'data' => $medicalRecord]);
        }

        $medicalRecord = MedicalRecord::with(['patient.user','doctor.user','examinations'])
            ->find($medicalRecordId);

        if (!$medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Zdravstveni karton nije pronađen'
            ], 404);
        }

        // 🔒 Provera pristupa
        if ($user->isPatient()) {
            $patient = $user->patientProfile;
            if ($medicalRecord->patient_id !== optional($patient)->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom kartonu'
                ], 403);
            }
        } elseif ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            if ($medicalRecord->doctor_id !== optional($doctor)->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom kartonu'
                ], 403);
            }
        }

        return response()->json(['success' => true, 'data' => $medicalRecord]);
    }

    // 📌 Pacijent menja lekara
    public function changeDoctor(Request $request, $id)
    {
        $medicalRecord = MedicalRecord::find($id);
        $user = Auth::user();

        if (!$medicalRecord) {
            return response()->json(['success' => false, 'message' => 'Karton nije pronađen'], 404);
        }

        if (!$user->isPatient()) {
            return response()->json(['success' => false, 'message' => 'Samo pacijent može promeniti lekara'], 403);
        }

        $patient = $user->patientProfile;
        if ($medicalRecord->patient_id !== $patient->id) {
            return response()->json(['success' => false, 'message' => 'Nemate ovlašćenje'], 403);
        }

        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id'
        ]);

        $medicalRecord->update(['doctor_id' => $validated['doctor_id']]);

        return response()->json([
            'success' => true,
            'message' => 'Lekar uspešno promenjen',
            'data' => $medicalRecord
        ]);
    }

    // 📌 Admin ili doktor ažurira karton
    public function updateMedicalRecord(Request $request, $id)
    {
        $medicalRecord = MedicalRecord::find($id);
        $user = Auth::user();

        if (!$medicalRecord) {
            return response()->json(['success' => false, 'message' => 'Karton nije pronađen'], 404);
        }

        // ✅ Provera ovlašćenja
        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            if ($medicalRecord->doctor_id !== $doctor->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate ovlašćenje za izmenu ovog kartona'
                ], 403);
            }
        } elseif (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo lekar ili administrator mogu ažurirati karton'
            ], 403);
        }

        // ✅ Validacija
        $validated = $request->validate([
            'blood_type' => 'sometimes|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'allergies' => 'sometimes|array',
            'chronic_diseases' => 'sometimes|array',
            'notes' => 'sometimes|string',
        ]);

        $medicalRecord->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Karton uspešno ažuriran',
            'data' => $medicalRecord
        ]);
    }

    // 📌 Vrati ID kartona na osnovu pacijenta
    public function getByPatientId($patientId)
    {
        $medicalRecord = MedicalRecord::where('patient_id', $patientId)->first();

        if (!$medicalRecord) {
            return response()->json(['success' => false, 'message' => 'Karton ne postoji'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => ['medical_record_id' => $medicalRecord->id]
        ]);
    }
}
