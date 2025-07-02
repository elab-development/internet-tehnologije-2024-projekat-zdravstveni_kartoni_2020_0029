<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'specialization' => $this->specialization,
            'description' => $this->description,
            'user' => new UserResource($this->whenLoaded('user')),
            'medical_records' => MedicalRecordResource::collection($this->whenLoaded('medicalRecords')),
        ];
    }
}