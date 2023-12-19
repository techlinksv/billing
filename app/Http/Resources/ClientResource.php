<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'document_1' => $this->document_1,
            'document_2' => $this->document_2,
            'document_3' => $this->document_3,
            'comments' => $this->comments,
            'deleted_at' => $this->deleted_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'country_id' => $this->country_id,
            'credit_limit' => $this->credit_limit,
            'company' => $this->company,
            'phone_2' => $this->phone_2,
            'address' => $this->address,
            'debt' => $this->debt,
            'available_credit' => $this->available_credit(),
            'used_credit_expired' => $this->used_credit_expired(),
        ];
    }
}
