<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MedicalRecordResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'doctor_id' => $this->doctor_id,
            'blood_type' => $this->blood_type,
            'allergies' => $this->allergies,
            'chronic_diseases' => $this->chronic_diseases,
            'opening_date' => $this->opening_date,
            'notes' => $this->notes,
            'patient' => new PatientResource($this->whenLoaded('patient')),
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
            'examinations' => ExaminationResource::collection($this->whenLoaded('examinations')),
        ];
    }
}