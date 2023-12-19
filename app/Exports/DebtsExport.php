<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\DebtsReportResource;
use App\Models\Credit;


class DebtsExport implements FromCollection,WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return DebtsReportResource::collection(
            Credit::with(['order','order.client'])
            ->when(request()->client_id, function (Builder $query, $client_id) {
                $query->whereHas('order', function (Builder $orderQuery) use ($client_id) {
                    $orderQuery->where('client_id', $client_id);
                });
            })   
            ->when(request()->state,
                function (Builder $query, string $state) {
                    $query->where('state',$state);
            })
            ->when(request()->from, function (Builder $query, $from) {
                $query->whereDate('created_at', '>=', $from);
            })
            ->when(request()->to, function (Builder $query, $to) {
                $query->whereDate('created_at', '<=', $to);
            })
            ->orderBy('created_at')->get()
        );
    }

     /**
    * @return array
    */
    public function headings(): array
    {
        // Define the headers here
        return [
            'Cliente',
            'Empresa',
            'Limite de credito',
            'Fecha de creación',
            'Fecha de vencimiento',
            'Monto',
            'Deuda',
            'Pagado',
            'Esta vencido',
            'ID Cliente',
            'ID Pais'
        ];
    }
}

