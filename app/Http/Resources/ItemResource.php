<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
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
            'order_id' => $this->order_id,
            'batch_id' => $this->batch_id,
            'quantity' => $this->quantity,
            'product' => ($this?->batch?->product)?new ProductResource($this?->batch?->product) : null,
            'price' => $this->price,
            'cost' => $this->cost,
            'created_at' => $this->created_at,
        ];
    }
}
