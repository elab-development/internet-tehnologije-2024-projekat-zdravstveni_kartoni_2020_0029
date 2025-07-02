<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'jmbg' => $this->jmbg,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'user' => new UserResource($this->whenLoaded('user')),
            'medical_records' => MedicalRecordResource::collection($this->whenLoaded('medicalRecords')),
        ];
    }
}