<?php

namespace App\Exports;

use App\Models\Product;
use App\Models\Item;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ReportEarningResource;
use Illuminate\Database\Eloquent\Builder;

class EarningsExport implements FromCollection,WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return
        ReportEarningResource::collection(Item::join('batches', 'items.batch_id', '=', 'batches.id')
                ->join('products', 'batches.product_id', '=', 'products.id')
                ->join('orders', 'items.order_id', '=', 'orders.id')
                ->where('orders.state', '=', 'activo')
                ->when(request()->warehouse_id,
                function (Builder $query, string $warehouse_id) {
                    $query->where('batches.warehouse_id',$warehouse_id);
                })
                ->when(request()->product_id,
                function (Builder $query, string $product_id) {
                    $query->where('batches.product_id',$product_id);
                })
                ->when(request()->from,
                function (Builder $query, string $from) {
                    $query->where('orders.created_at','>=',$from);
                })
                ->when(request()->to,
                function (Builder $query, string $to) {
                    $query->where('orders.created_at','<=',$to);
                })

                ->select('products.name as product_name', 
                        'products.sku', // Include SKU in the select
                        'items.price',
                        'items.cost',
                        \DB::raw('SUM(items.quantity) as total_units'),
                        \DB::raw('SUM(items.quantity * (items.price - items.cost)) as total_earnings'))
                ->groupBy('products.name','products.sku' ,'items.price', 'items.cost')->get()
            );
    }

     /**
    * @return array
    */
    public function headings(): array
    {
        // Define the headers here
        return [
            'Producto',
            'SKU',
            'Precio',
            'Costo',
            'Ganancias',
            'Total unidades',
            'Total Ganancias',
        ];
    }
}
