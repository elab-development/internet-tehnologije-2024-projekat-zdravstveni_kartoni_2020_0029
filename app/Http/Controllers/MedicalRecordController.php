<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MedicalRecordController extends Controller
{
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

    public function show($medicalRecordId = null) {
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
            if ($medicalRecord->doctor_id === optional($doctor)->id) {
            } else {
                $hasAppointment = \App\Models\Appointment::where('medical_record_id', $medicalRecord->id)
                    ->where('doctor_id', optional($doctor)->id)
                    ->exists();

                if (!$hasAppointment) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Nemate pristup ovom kartonu'
                    ], 403);
                }
            }
        }

        return response()->json(['success' => true, 'data' => $medicalRecord]);
    }

    public function getMyMedicalRecordId()
        {
        $user = Auth::user();

        if ($user->isPatient()) {
            $patient = $user->patientProfile;

            if (!$patient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate povezan pacijent profil'
                ], 404);
            }

            $medicalRecord = MedicalRecord::with(['patient.user','doctor.user','examinations'])
                ->where('patient_id', $patient->id)
                ->first();

            if (!$medicalRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate zdravstveni karton'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $medicalRecord->id
                ]
            ]);
        }

        $medicalRecord = MedicalRecord::with(['patient.user','doctor.user','examinations'])
            ->find($medicalRecordId);

        if (!$medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Zdravstveni karton nije pronađen'
            ], 404);
        }

        if ($user->isDoctor()) {
            $doctor = $user->doctorProfile;
            if ($medicalRecord->doctor_id !== optional($doctor)->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate pristup ovom kartonu'
                ], 403);
            }
        }


        return response()->json([
            'success' => true,
            'data' => $medicalRecord->id
        ]);
    }


    public function updateMedicalRecord(Request $request, $id)
    {
        $medicalRecord = MedicalRecord::find($id);
        $user = Auth::user();

        if (!$medicalRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Karton nije pronađen'
            ], 404);
        }

        if ($user->isDoctor() && !$user->doctorProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Doktor nema profil'
            ], 403);
        } elseif (!$user->isDoctor() && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo lekar ili administrator mogu ažurirati karton'
            ], 403);
        }

        $validated = $request->validate([
            'blood_type'        => 'nullable|string|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'allergies'         => 'nullable|array',
            'chronic_diseases'  => 'nullable|array',
            'notes'             => 'nullable|string',
        ]);

        $medicalRecord->fill($validated)->save();

        return response()->json([
            'success' => true,
            'message' => 'Karton uspešno ažuriran',
            'data'    => $medicalRecord->fresh()
        ]);
    }


}


