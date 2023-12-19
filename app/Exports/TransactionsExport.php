<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\TransactionResource;
use App\Models\Credit;


class TransactionsExport implements FromCollection,WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect(TransactionResource::collection(
            Transaction::with(['category','user'])->when(request()->type,
                function (Builder $query, string $type) {
                    $query->where('type',$type);
                })
                ->when(request()->search, function (Builder $query, $search) {
                    // Use whereHas to apply conditions on the related Category model
                    $query->whereHas('category', function ($query) use ($search) {
                        // Use 'like' operator for case-insensitive search
                        $query->where('category', 'like', '%' . $search . '%');
                    });
                })
                ->when(request()->method,
                function (Builder $query, string $method) {
                    $query->where('method',$method);
                })
                
                ->when(request()->from,
                function (Builder $query, string $from) {
                    $query->where('date','>=',$from);
                })
                ->when(request()->to,
                function (Builder $query, string $to) {
                    $query->where('date','<=',$to);
                })
                ->orderBy('date','desc')
                ->get()
            )->collection->map(
                function($c){
                    return json_decode($c->toJson()); //force resource mapping
                }
            )          
            ->map(
                function ($transaction) {
                    return (object)[
                        'Id' => $transaction->id,
                        'Fecha' => $transaction->date,
                        'Categoria' => $transaction->category->category,
                        'Razon' => $transaction->reason,
                        'Monto' => $transaction->amount,
                        'Usuario' => $transaction->user->name,
                        'Tipo de pago' => $transaction->method,
                    ];
                }
            ));
    }

     /**
    * @return array
    */
    public function headings(): array
    {
        // Define the headers here
        return [
            'Id',
           'Fecha',
           'Categoria',
           'Razon',
           'Monto',
           'Usuario',
           'Tipo de pago',
        ];
    }
}

