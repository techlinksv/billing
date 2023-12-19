<?php

namespace App\Exports;

use App\Models\Movement;
use App\Models\Batch;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Http\Resources\MovementResource;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class MovementsExport implements FromCollection,WithHeadings,ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return MovementResource::collection(
            Movement::with(['user','batch','batch.product'])
                ->when(request()->search,
                function (Builder $query, string $search) {
                    $searchTerm = '%' . strtolower($search) . '%';
                    $users = User::whereRaw('LOWER(name) LIKE ?', [$searchTerm])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$searchTerm])
                        ->orWhereRaw('LOWER(type) LIKE ?', [$searchTerm]);
                })
                ->when(request()->type,function (Builder $query, string $type) {
                    $query->where('type',$type );
                })
                ->when(request()->warehouse_id,function (Builder $query, string $warehouse_id) {
                    $query->whereIn('batch_id',Batch::where('warehouse_id',$warehouse_id)->get()->pluck('id'));
                })
                ->when(request()->product_id,function (Builder $query, string $product_id) {
                    $query->whereIn('batch_id',Batch::where('product_id',$product_id)->get()->pluck('id'));
                })->orderBy('created_at','desc')
                ->get())->collection->map(
                    function($c){
                        return json_decode($c->toJson()); //force resource mapping
                    }
                )->map(function($m){
                    return [
                        'id' => $m->id,
                        'batch_id' => $m->batch_id,
                        'user' => $m->user?->name,
                        'type' => $m->type,
                        'code' => $m->batch?->product?->sku ?? '',
                        'quantity' => $m->quantity,
                        'comments' => $m->comments,
                        'created_at' => $m->created_at,
                        'canceled' => ($m->canceled)?'Si':'',
                    ];
                });
    }

     /**
    * @return array
    */
    public function headings(): array
    {
        // Define the headers here
        return [
            'ID',
            'ID Inventario',
            'Usuario',
            'Tipo',
            'Código',
            'Cantidad',
            'Comentarios',
            'Creado el',
            'Anulado'
        ];
    }
}
