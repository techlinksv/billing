<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Batch;

class ProductAdminExportResource extends JsonResource
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
            'created_at' => \Carbon\Carbon::parse($this->created_at)->format('d/m/Y H:i:s'),
            'updated_at' => \Carbon\Carbon::parse($this->updated_at)->format('d/m/Y H:i:s'),
            'quantity' => ($batch)?$batch->quantity:null,
            'price' => $this->price,
            'total' => ($batch)?$batch->quantity*$this->price:null,
            'description' => $this->description,
            'comments' => $this->comments,
            'batch_id'=> ($batch)?$batch->id:null,
        ];
        
    }
}
