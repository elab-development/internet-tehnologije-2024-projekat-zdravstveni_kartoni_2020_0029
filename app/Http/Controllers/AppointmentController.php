<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Vrati termine po ulozi.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Appointment::with([
            'medicalRecord.patient.user:id,name,email',
            'doctor.user:id,name,email',
            'nurse.user:id,name,email',
        ]);

        // filter pacijenta
        if ($request->filled('patient')) {
            $search = $request->input('patient');
            $query->whereHas('medicalRecord.patient.user', fn($q) =>
                $q->where('name', 'like', '%' . $search . '%')
            );
        }

        // filter doktora
        if ($request->filled('doctor')) {
            $search = $request->input('doctor');
            $query->whereHas('doctor.user', fn($q) =>
                $q->where('name', 'like', '%' . $search . '%')
            );
        }

        // filter statusa
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // restrikcija po ulozi
        if ($user->isDoctor()) {
            $doctorId = optional($user->doctorProfile)->id;
            if (!$doctorId) {
                return response()->json(['success' => false, 'message' => 'Doktor nema profil.'], 403);
            }
            $query->where('doctor_id', $doctorId);

        } elseif ($user->isNurse()) {
            $nurseId = optional($user->nurseProfile)->id;
            if (!$nurseId) {
                return response()->json(['success' => false, 'message' => 'Sestra nema profil.'], 403);
            }
            $query->where('nurse_id', $nurseId);

        } elseif ($user->isPatient()) {
            $patientId = optional($user->patientProfile)->id;
            if (!$patientId) {
                return response()->json(['success' => false, 'message' => 'Pacijent nema profil.'], 403);
            }
            $query->whereHas('medicalRecord', fn($q) =>
                $q->where('patient_id', $patientId)
            );
        }

        $appointments = $query->get()->map(fn($appointment) =>
            $this->formatAppointment($appointment)
        );

        return response()->json(['success' => true, 'data' => $appointments]);
    }

    /**
     * Kreiraj novi termin.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'nurse'])) {
            return response()->json(['success' => false, 'message' => 'Nemate dozvolu za kreiranje termina.'], 403);
        }

        $data = $request->validate([
            'medical_record_id' => 'required|exists:medical_records,id',
            'doctor_id'         => 'required|exists:doctors,id',
            'scheduled_at'      => 'required|date',
            'appointment_date'  => 'required|date|after_or_equal:today',
            'status'            => 'required|in:scheduled,completed,canceled,no_show',
        ]);

        if ($user->isNurse() && $user->nurseProfile) {
            $data['nurse_id'] = $user->nurseProfile->id;
        } elseif ($user->isAdmin()) {
            // admin može da upiše sebe kao nurse_id (vezano za user_id)
            $data['nurse_id'] = $user->id;
        }

        $appointment = Appointment::create($data)->load(['doctor.user', 'nurse.user', 'medicalRecord.patient.user']);

        return response()->json([
            'success' => true,
            'data'    => $this->formatAppointment($appointment),
        ], 201);
    }

    /**
     * Ažuriraj status ili doktora.
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $appointment = Appointment::with(['doctor.user', 'nurse.user', 'medicalRecord.patient.user'])->findOrFail($id);

        if (!in_array($user->role, ['admin', 'doctor', 'nurse'])) {
            return response()->json(['success' => false, 'message' => 'Nemate dozvolu za izmenu termina.'], 403);
        }

        $rules = [];
        if ($user->isDoctor() || $user->isAdmin()) {
            $rules = [
                'status'    => 'sometimes|in:scheduled,completed,canceled,no_show',
                'doctor_id' => 'sometimes|exists:doctors,id',
            ];
        } elseif ($user->isNurse()) {
            if ($appointment->nurse_id !== optional($user->nurseProfile)->id) {
                return response()->json(['success' => false, 'message' => 'Nemate dozvolu za izmenu ovog termina.'], 403);
            }
            $rules = [
                'status' => 'required|in:scheduled,completed,canceled,no_show',
            ];
        }

        $validated = $request->validate($rules);
        $appointment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Termin uspešno ažuriran.',
            'data'    => $this->formatAppointment($appointment->fresh(['doctor.user', 'nurse.user', 'medicalRecord.patient.user'])),
        ]);
    }

    /**
     * Obriši termin.
     */
    public function deleteAppointment(Request $request, $id)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'nurse'])) {
            return response()->json(['success' => false, 'message' => 'Nemate dozvolu za brisanje termina.'], 403);
        }

        $appointment = Appointment::findOrFail($id);

        if ($user->isNurse() && $appointment->nurse_id !== optional($user->nurseProfile)->id) {
            return response()->json(['success' => false, 'message' => 'Možete brisati samo vaše termine.'], 403);
        }

        $appointment->delete();

        return response()->json(['success' => true, 'message' => 'Termin uspešno obrisan.']);
    }

    /**
     * Helper za formatiranje.
     */
    private function formatAppointment(Appointment $appointment)
    {
        return [
            'appointment_id'    => $appointment->id,
            'medical_record_id' => $appointment->medical_record_id, // 👈 DODATO
            'patient'           => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
            'doctor'            => $appointment->doctor ? [
                'id'             => $appointment->doctor->id,
                'name'           => $appointment->doctor->user->name,
                'specialization' => $appointment->doctor->specialization,
            ] : null,
            'nurse'             => $appointment->nurse ? [
                'id'      => $appointment->nurse->id,
                'user_id' => $appointment->nurse->user->id,
                'name'    => $appointment->nurse->user->name,
                'email'   => $appointment->nurse->user->email,
            ] : null,
            'appointment_date'  => $appointment->appointment_date,
            'status'            => $appointment->status,
        ];
    }
}
