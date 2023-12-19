<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\Batch;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ExcelProductImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {

        if($row['nombre'] == null){
            return null;
        }
        
        $country_id = (auth('web')?->user()?->country_id) ? auth()?->user()?->country_id : request()->country_id;
        if(!$country_id){
            $country_id = $row['id_pais'];
        }

        $product = Product::where('sku',$row['sku'])->first();
        if($product==null){
            $product = new Product([
                'sku' => $row['sku'],
                'name' => $row['nombre'],
                'size' => 0,
                'units' => $row['unidades'],
                'price' => ($row['costo']) ? $row['costo'] : 0,
                'country_id' => $country_id,
                'comments' => $row['comentarios'],
            ]);
        }

        if($row['costo']){
            $product->price = $row['costo'];
        }
        $product->save();

        if($row['cantidad'] && $row['costo'] && request()->warehouse_id){
            $batch = new Batch();
            $batch->product_id = $product->id;
            $batch->warehouse_id = request()->warehouse_id;
            $batch->quantity = $row['cantidad'];
            $batch->save();
        }
    }
}
