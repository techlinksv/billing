<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Http\Resources\ProductExportResource;
use App\Http\Resources\ProductAdminExportResource;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ProductsExport implements FromCollection,WithHeadings,ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        if(auth('api')->checK() && auth('api')->user()?->role->role == 'admin'){
            $products = ProductAdminExportResource::collection(Product::when(request()->search,
            function (Builder $query, string $search) {
            $searchTerm = '%' . strtolower($search) . '%';
            $query->whereRaw('LOWER(sku) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(name) LIKE ?', [$searchTerm]);
            })->orderBy('created_at','desc')->get());
            $total = 0;
            foreach($products as $product){
                $p =  json_decode(json_encode($product));
                $total += $p->total;
            }
            $products->push([
                'id' => 'Total',
                'sku' => '',
                'name' => '',
                'size' => '',
                'units' => '',
                'country_id' => '',
                'created_at' => '',
                'updated_at' => '',
                'quantity' => '',
                'price' => '',
                'total' => $total,
                'description' => '',
                'comments' => '',
                'batch_id'=> '',
            ]);
        }else{
            $products = ProductExportResource::collection(Product::when(request()->search,
            function (Builder $query, string $search) {
            $searchTerm = '%' . strtolower($search) . '%';
            $query->whereRaw('LOWER(sku) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(name) LIKE ?', [$searchTerm]);
            })->orderBy('created_at','desc')->get());
        }

     

        return $products;

    }

     /**
    * @return array
    */
    public function headings(): array
    {
        if(auth('api')->checK() && auth('api')->user()?->role->role == 'admin'){
            // Define the headers here
            return [
                'ID',
                'SKU',
                'Nombre',
                'Tamaño',
                'Unidades',
                'ID País',
                'Creado el',
                'Actualizado el',
                'Cantidad',
                'Precio',
                'Total',
                'Descripción',
                'Comentarios',
                'ID Inventario',
            ];
        }
        // Define the headers here
        return [
            'ID',
            'SKU',
            'Nombre',
            'Tamaño',
            'Unidades',
            'ID País',
            'Creado el',
            'Actualizado el',
            'Cantidad',
          //  'Precio',
          // 'Total',
            'Descripción',
            'Comentarios',
            'ID Inventario',
        ];
    }
}
