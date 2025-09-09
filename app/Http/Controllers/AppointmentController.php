<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Vrati sve termine za datog doktora.
     */
    public function byDoctor($doctorId)
    {
        $appointments = Appointment::with([
                'medicalRecord.patient.user:id,name,email',
                'user:id,name,email' // ko je zakazao (sestra/admin/pacijent)
            ])
            ->whereHas('medicalRecord', function ($query) use ($doctorId) {
                $query->where('doctor_id', $doctorId);
            })
            ->get()
            ->map(function ($appointment) {
                return [
                    'appointment_id'  => $appointment->id,
                    'patient'         => $appointment->medicalRecord->patient->user->name ?? 'Nepoznat',
                    'scheduled_by'    => $appointment->user->name ?? 'Nepoznat',
                    'appointment_date'=> $appointment->appointment_date,
                    'status'          => $appointment->status,
                ];
            });

        return response()->json($appointments);
    }
}

