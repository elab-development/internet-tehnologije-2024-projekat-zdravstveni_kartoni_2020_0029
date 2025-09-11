<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Vrati termine za doktora ili sve ako je admin.
     */
    public function byDoctor(Request $request, $doctorId)
    {
        $user = $request->user(); // dohvati ulogovanog usera

        $query = Appointment::with([
            'medicalRecord.patient.user:id,name,email',
            'user:id,name,email'
        ]);

        // Ako je admin → vidi sve
        if ($user->role !== 'admin') {
            // Ako je doktor → vidi samo svoje
            $query->whereHas('medicalRecord', function ($q) use ($doctorId) {
                $q->where('doctor_id', $doctorId);
            });
        }

        $appointments = $query->get()->map(function ($appointment) {
            return [
                'appointment_id'   => $appointment->id,
                'patient'          => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
                'scheduled_by'     => $appointment->user->name ?? 'Nepoznat',
                'appointment_date' => $appointment->appointment_date,
                'status'           => $appointment->status,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }
}


