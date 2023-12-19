<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportEarningResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'product_name' => $this->product_name,
            'sku' => $this->sku,
            'price' => $this->price,
            'cost' => $this->cost,
            'earning' => $this->price - $this->cost,
            'total_units' => $this->total_units,
            'total_earnings' => $this->total_earnings,
        ];
    }
}
