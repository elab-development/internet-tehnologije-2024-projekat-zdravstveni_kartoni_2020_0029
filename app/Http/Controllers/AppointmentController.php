<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Nurse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Vrati termine za doktora, pacijenta, sestru ili sve ako je admin.
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
        if ($user->role !== 'admin') {
            if ($user->role === 'doctor' && $user->doctorProfile) {
                $query->where('doctor_id', $user->doctorProfile->id);
            } elseif ($user->role === 'nurse' && $user->nurse) {
                $query->where('nurse_id', $user->nurse->id);
            } elseif ($user->role === 'patient' && $user->patientProfile) {
                $query->whereHas('medicalRecord', fn($q) =>
                    $q->where('patient_id', $user->patientProfile->id)
                );
            }
        }

        $appointments = $query->get()->map(fn($appointment) => [
            'appointment_id'   => $appointment->id,
            'patient'          => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
            'doctor'           => $appointment->doctor ? [
                'id'             => $appointment->doctor->id,
                'name'           => $appointment->doctor->user->name,
                'specialization' => $appointment->doctor->specialization,
            ] : null,
            'nurse'            => $appointment->nurse ? [
                'id'      => $appointment->nurse->id,
                'user_id' => $appointment->nurse->user->id,
                'name'    => $appointment->nurse->user->name,
                'email'   => $appointment->nurse->user->email,
            ] : null,
            'appointment_date' => $appointment->appointment_date,
            'status'           => $appointment->status,
        ]);

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

        if ($user->role === 'nurse' && $user->nurse) {
            $data['nurse_id'] = $user->nurse->id;
        } elseif ($user->role === 'admin') {
            $data['nurse_id'] = Nurse::inRandomOrder()->first()?->id;
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
        if ($user->role === 'doctor' || $user->role === 'admin') {
            $rules = [
                'status'    => 'sometimes|in:scheduled,completed,canceled,no_show',
                'doctor_id' => 'sometimes|exists:doctors,id',
            ];
        } elseif ($user->role === 'nurse') {
            if ($appointment->nurse_id !== $user->nurse->id) {
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

        if (!$user || $user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Samo administrator može obrisati termin.'], 403);
        }

        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json(['success' => true, 'message' => 'Termin uspešno obrisan.']);
    }

    /**
     * Helper za formatiranje.
     */
    private function formatAppointment(Appointment $appointment)
    {
        return [
            'appointment_id'   => $appointment->id,
            'patient'          => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
            'doctor'           => $appointment->doctor ? [
                'id'             => $appointment->doctor->id,
                'name'           => $appointment->doctor->user->name,
                'specialization' => $appointment->doctor->specialization,
            ] : null,
            'nurse'            => $appointment->nurse ? [
                'id'      => $appointment->nurse->id,
                'user_id' => $appointment->nurse->user->id,
                'name'    => $appointment->nurse->user->name,
                'email'   => $appointment->nurse->user->email,
            ] : null,
            'appointment_date' => $appointment->appointment_date,
            'status'           => $appointment->status,
        ];
    }
}
