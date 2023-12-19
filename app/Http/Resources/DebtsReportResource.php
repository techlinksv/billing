<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DebtsReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'client' => $this->order->client?->first_name.' '.$this->order->client?->last_name,
            'company' => $this->order->client?->company,
            'limit_credit' => $this->order->client?->credit_limit,
            'date' => $this->created_at,
            'expire_at' => $this->expire_at,
            'amount' => $this->amount,
            'debt' => $this->debt,
            'paid' => $this->paid,
            'expired' => (($this?->debt > 0) && ($this->expire_at < \Carbon\Carbon::now())),
            'client_id' =>  $this?->order?->client?->id,
            'country_id' => $this?->order?->country_id,
        ];
    }
}
