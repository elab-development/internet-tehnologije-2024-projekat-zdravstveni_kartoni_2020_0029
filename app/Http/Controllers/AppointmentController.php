<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Vrati termine za doktora ili sve ako je admin.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Appointment::with([
            'medicalRecord.patient.user:id,name,email',
            'user:id,name,email'
        ]);

        // 🔎 filtriranje po pacijentu
        // 🔎 filtriranje po pacijentu (ime pacijenta)
        if ($request->filled('patient')) {
            $search = $request->input('patient');
            $query->whereHas('medicalRecord.patient', function ($q) use ($search) {
                $q->whereHas('user', function ($sub) use ($search) {
                    $sub->where('name', 'like', '%' . $search . '%');
                });
            });
        }

        // 🔎 filtriranje po statusu
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }


        // 👮 restrikcija po ulozi
        if ($user->role !== 'admin') {
            $query->whereHas('medicalRecord', function ($q) use ($user) {
                if ($user->role === 'doctor') {
                    $q->where('doctor_id', $user->id);
                } elseif ($user->role === 'nurse') {
                    $q->where('nurse_id', $user->id);
                }
            });
        }

        $appointments = $query->get()->map(function ($appointment) {
            return [
                'appointment_id' => $appointment->id,
                'patient' => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
                'scheduled_by' => $appointment->user->name ?? 'Nepoznat',
                'appointment_date' => $appointment->appointment_date,
                'status' => $appointment->status,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }




    public function store(Request $request)
    {
        $user = $request->user();

        // Provera dozvole za kreiranje
        if (!in_array($user->role, ['admin', 'nurse'])) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate dozvolu za kreiranje termina.'
            ], 403);
        }

        // Validacija ulaznih podataka
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'medical_record_id' => 'required|exists:medical_records,id',
            'scheduled_at' => 'required|date',
            'appointment_date' => 'required|date|after_or_equal:today',
            'status' => 'required|in:scheduled,completed,canceled,no_show',
        ]);

        // Kreiranje novog termina
        $appointment = \App\Models\Appointment::create($data);

        return response()->json([
            'success' => true,
            'data' => $appointment
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        // provera da li postoji user
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Niste autentifikovani.'
            ], 401);
        }

        // Samo admin ili doktor mogu menjati status
        if (!in_array($user->role, ['admin', 'doctor'])) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate dozvolu za izmenu termina.'
            ], 403);
        }

        // ako ne postoji termin, automatski baci 404
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:scheduled,completed,canceled,no_show',
        ]);

        $appointment->status = $validated['status'];
        $appointment->save();

        return response()->json([
            'success' => true,
            'message' => 'Status termina uspešno ažuriran.',
            'data' => $appointment,
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

        // Samo admin može brisati
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


