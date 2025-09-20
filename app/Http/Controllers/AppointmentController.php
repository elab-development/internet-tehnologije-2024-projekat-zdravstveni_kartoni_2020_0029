<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
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
            'user:id,name,email',
            'doctor.user:id,name,email'
        ]);

        // filter pacijenta
        if ($request->filled('patient')) {
            $search = $request->input('patient');
            $query->whereHas('medicalRecord.patient.user', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        // filter doktora
        if ($request->filled('doctor')) {
            $search = $request->input('doctor');
            $query->whereHas('doctor.user', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        // filter statusa
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // restrikcija po ulozi
        if ($user->role !== 'admin') {
            if ($user->role === 'doctor') {
                $query->where('doctor_id', $user->doctorProfile->id);
            } elseif ($user->role === 'nurse') {
                $query->where('nurse_id', $user->id);
            } elseif ($user->role === 'patient') {
                $query->whereHas('medicalRecord', function ($q) use ($user) {
                    $q->where('patient_id', $user->patientProfile->id);
                });
            }
        }

        $appointments = $query->get()->map(function ($appointment) {
            return [
                'appointment_id'   => $appointment->id,
                'patient'          => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
                'scheduled_by'     => $appointment->user->name ?? 'Nepoznat',
                'doctor'           => $appointment->doctor ? [
                    'id'             => $appointment->doctor->id,
                    'name'           => $appointment->doctor->user->name,
                    'specialization' => $appointment->doctor->specialization,
                ] : null,
                'appointment_date' => $appointment->appointment_date,
                'status'           => $appointment->status,
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $appointments,
        ]);
    }

    /**
     * Kreiraj novi termin.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['admin', 'nurse'])) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate dozvolu za kreiranje termina.'
            ], 403);
        }

        $data = $request->validate([
            'user_id'           => 'required|exists:users,id',
            'medical_record_id' => 'required|exists:medical_records,id',
            'doctor_id'         => 'required|exists:doctors,id',
            'scheduled_at'      => 'required|date',
            'appointment_date'  => 'required|date|after_or_equal:today',
            'status'            => 'required|in:scheduled,completed,canceled,no_show',
        ]);

        $appointment = Appointment::create($data);

        return response()->json([
            'success' => true,
            'data'    => [
                'appointment_id'   => $appointment->id,
                'patient'          => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
                'scheduled_by'     => $appointment->user->name ?? 'Nepoznat',
                'doctor'           => $appointment->doctor ? [
                    'id'             => $appointment->doctor->id,
                    'name'           => $appointment->doctor->user->name,
                    'specialization' => $appointment->doctor->specialization,
                ] : null,
                'appointment_date' => $appointment->appointment_date,
                'status'           => $appointment->status,
            ]
        ], 201);
    }

    /**
     * Menjaj status ili doktora.
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $appointment = Appointment::findOrFail($id);

        if (!in_array($user->role, ['admin', 'doctor'])) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate dozvolu za izmenu termina.'
            ], 403);
        }

        $validated = $request->validate([
            'status'    => 'sometimes|in:scheduled,completed,canceled,no_show',
            'doctor_id' => 'sometimes|exists:doctors,id',
        ]);

        $appointment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Termin uspešno ažuriran.',
            'data'    => [
                'appointment_id'   => $appointment->id,
                'patient'          => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
                'scheduled_by'     => $appointment->user->name ?? 'Nepoznat',
                'doctor'           => $appointment->doctor ? [
                    'id'             => $appointment->doctor->id,
                    'name'           => $appointment->doctor->user->name,
                    'specialization' => $appointment->doctor->specialization,
                ] : null,
                'appointment_date' => $appointment->appointment_date,
                'status'           => $appointment->status,
            ]
        ]);
    }

    /**
     * Obriši termin.
     */
    public function deleteAppointment(Request $request, $id)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Niste autentifikovani.'
            ], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Samo administrator može obrisati termin.'
            ], 403);
        }

        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Termin uspešno obrisan.'
        ]);
    }
}
