<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Item;
use App\Models\Credit;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $items = Item::where('order_id',$this->id)->get();
        $credit = Credit::where('order_id',$this->id)->first();
        $total = ($items)?$items->map(function ($item) {
            return $item['quantity'] * $item['price'];
        })->sum():0.00;
        return [
            "id" => $this->id,
            "bill_number" => $this->bill_number,
            "client_company" => $this->client_company,
            "client_first_name" => $this->client_first_name,
            "client_last_name" => $this->client_last_name,
            "client_document_1" => $this->client_document_1,
            "client_document_2" => $this->client_document_2,
            "payment_type" => $this->payment_type,
            "client_id" => $this->client_id,
            "client" => ($this->client)?new ClientResource($this->client):null,
            "updated_at" => $this->updated_at,
            "created_at" => $this->created_at,
            "total" => $this->total + $this->tax + $this->total_iva,
            "subtotal" => $this->total,
            "credit_expire_at" => ($credit)?$credit->expire_at:null,
            "items" => ($items)?ItemResource::collection($items):[],
            "debt" => ($credit)?$credit?->debt:null,
            "state" => $this->state,
            "tax" => round($this->tax,2),
            "iva" => round($this->total_iva,2),
            "country_id" => $this->country_id,
            "user" => ($this->user) ? new UserResource($this->user) : null,
        ];
    }
}
