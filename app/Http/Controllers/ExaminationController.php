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
        
        if (!$user->isDoctor()) {
            return response()->json([
                'success' => false,
                'message' => 'Samo lekar može kreirati pregled'
            ], 403);
        }

        $validated = $request->validate([
            'medical_record_id' => 'required|exists:medical_records,id',
            'symptom_description' => 'required|string|max:1000',
            'diagnosis' => 'required|string|max:500',
            'therapy' => 'required|string|max:500',
        ]);

        $doctor = $user->doctorProfile;
        $medicalRecord = MedicalRecord::findOrFail($validated['medical_record_id']);

        // Provera da li lekar ima pristup kartonu
        if ($medicalRecord->doctor_id !== $doctor->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate pristup ovom zdravstvenom kartonu'
            ], 403);
        }

        $examination = Examination::create([
            'medical_record_id' => $medicalRecord->id,
            'doctor_id' => $doctor->id,
            'doctor_name' => $user->name,
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

        if ($user->isPatient()) {
            $patient = $user->patientProfile;
            $query->whereHas('medicalRecord', function($q) use ($patient) {
                $q->where('patient_id', $patient->id);
            });
        } 
        elseif ($user->isDoctor()) {
            $query->where('doctor_id', $user->doctorProfile->id);
        }
        else {
            return response()->json([
                'success' => false,
                'message' => 'Nemate pristup pregledima'
            ], 403);
        }

        // Filtriranje po datumu
        if ($request->has('date_from')) {
            $query->where('examination_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('examination_date', '<=', $request->date_to);
        }

        // Sortiranje
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

        // Provera ovlašćenja (samo lekar koji je kreirao pregled)
        if ($examination->doctor_id !== $user->doctorProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za izmenu ovog pregleda'
            ], 403);
        }

        $validated = $request->validate([
            'symptom_description' => 'sometimes|string|max:1000',
            'diagnosis' => 'sometimes|string|max:500',
            'therapy' => 'sometimes|string|max:500',
        ]);

        $examination->update($validated);

        return response()->json([
            'success' => true,
            'data' => $examination->fresh(['medicalRecord.patient.user'])
        ]);
    }

    /**
     * Brisanje pregleda
     */
    public function destroy($id)
    {
        $examination = Examination::findOrFail($id);
        $user = Auth::user();

        // Provera ovlašćenja (samo lekar koji je kreirao pregled)
        if ($examination->doctor_id !== $user->doctorProfile->id) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate ovlašćenje za brisanje ovog pregleda'
            ], 403);
        }

        $examination->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pregled uspešno obrisan'
        ]);
    }
}