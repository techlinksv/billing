<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientDebtsResource extends JsonResource
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
            'company' => $this->company,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'credit_limit' => $this->credit_limit,
            'available_credit' => $this->available_credit(),
            'used_credit_expired' => $this->used_credit_expired(),
            'debt_not_expired' => $this->debt - $this->used_credit_expired(),
            'debt' => $this->debt,
        ];
    }
}
