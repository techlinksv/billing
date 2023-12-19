<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Batch;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {    
        $batch = (request()->warehouse_id)?
        Batch::where('warehouse_id',request()->warehouse_id)->where('product_id',$this->id)->first()
        :null;

        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'size' => $this->size,
            'units' => $this->units,
            'country_id' => $this->country_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'quantity' => ($batch)?$batch->quantity:null,
            'price' => $this->price,
            'total' =>  ($batch)?$batch->quantity * $this->price:0,
            'description' => $this->description,
            'comments' => $this->comments,
            'batch_id'=> ($batch)?$batch->id:null,
        ];
        
    }
}
