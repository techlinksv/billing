<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Http\Resources\ProductSalesResource;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ProductBatchExport implements FromCollection,WithHeadings,ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $products =
        ProductSalesResource::collection(
            Product::with(['batches.items.order' => function ($query) {
                $query->where('state', 'activo');
            }])
            ->get()
            ->map(function ($product) {
                $batches = $product->batches;
                if(request()->warehouse_id){
                    $batches = $batches->where('warehouse_id',request()->warehouse_id);
                }
                $product->quantity = $batches->sum(function ($batch) {
                    $items = $batch->items; 
                    if(request()->from){
                        $items = $items->where('created_at','>=',request()->from);
                    }
                    if(request()->to){
                        $items = $items->where('created_at','<=',request()->to);
                    }

                    return $items->sum('quantity');
                });

                $product->sales = $batches->sum(function ($batch) {
                    $items = $batch->items; 
                    if(request()->from){
                        $items = $items->where('created_at','>=',request()->from);
                    }
                    if(request()->to){
                        $items = $items->where('created_at','<=',request()->to);
                    }
                    return $batch->items->sum('quantity') * $batch->items->sum('price');
                });
        
                $product->cost = $batches->sum(function ($batch) {
                    $items = $batch->items; 
                    if(request()->from){
                        $items = $items->where('created_at','>=',request()->from);
                    }
                    if(request()->to){
                        $items = $items->where('created_at','<=',request()->to);
                    }
                    return $items->sum('quantity') * $items->sum('cost');
                });
                    unset($product->batches);
                    return $product;
                })->sortByDesc('quantity')
            );
        return $products;
    }

     /**
    * @return array
    */
    public function headings(): array
    {
        // Define the headers here
        return [
            'ID',
            'SKU',
            'Nombre',
            'Unidades',
            'Ventas',
            'Tamaño',
            'Cantidad',
            'Precio',
            'Descripción',
            'Comentarios',
            'ID País',
            'Creado el',
            'Actualizado el',        
            'Borrado el',        

        ];
    }
}
