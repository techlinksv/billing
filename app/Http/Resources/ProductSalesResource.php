<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductSalesResource extends JsonResource
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
            'sku' => $this->sku,
            'name' => $this->name,
            'units' => $this->units,
            'sales' => $this->sales,
            'size' => $this->size,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'description' => $this->description,
            'comments' => $this->comments,
            'country_id' => $this->country_id,
            'deleted_at' => $this->deleted_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
