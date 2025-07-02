<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExaminationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'medical_record_id' => $this->medical_record_id,
            'doctor_id' => $this->doctor_id,
            'doctor_name' => $this->doctor_name,
            'symptom_description' => $this->symptom_description,
            'examination_date' => $this->examination_date,
            'diagnosis' => $this->diagnosis,
            'therapy' => $this->therapy,
            'medical_record' => new MedicalRecordResource($this->whenLoaded('medicalRecord')),
            'doctor' => new DoctorResource($this->whenLoaded('doctor')),
        ];
    }
}
