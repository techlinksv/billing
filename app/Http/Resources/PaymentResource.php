<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Credit;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $credit = Credit::find($this->credit_id);
        return [
            'id' => $this->id,
            'credit_id' => $this->credit_id,
            'order_id' => ($credit)?$credit?->order?->id:null,
            'bill_number' => ($credit)?$credit?->order?->bill_number:null,
            'payment_bill_number' => $this->bill_number,
            'amount' => $this->amount,
            'comments' => $this->comments,
            'credit' => ($credit)?new CreditResource($credit):null,
            'created_at' => $this->created_at,
            'deleted' => $this->deleted_at ? true : false,
            "user" => ($this->user) ? new UserResource($this->user) : null,
        ];
    }
}
