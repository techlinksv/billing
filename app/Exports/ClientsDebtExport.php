<?php

namespace App\Exports;

use App\Models\Client;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Resources\ClientDebtsResource;
use App\Models\Credit;


class ClientsDebtExport implements FromCollection,WithHeadings,ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return ClientDebtsResource::collection(Client::when(request()->search,
            function (Builder $query, string $search) {
                $searchTerm = '%' . strtolower($search) . '%';
                $query->whereRaw('LOWER(first_name) LIKE ?', [$searchTerm])
                    ->orWhereRaw('LOWER(last_name) LIKE ?', [$searchTerm])
                    ->orWhereRaw('LOWER(company) LIKE ?', [$searchTerm])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$searchTerm])
                    ->orWhereRaw('LOWER(document_1) LIKE ?', [$searchTerm]);
            })->get());
    }

     /**
    * @return array
    */
    public function headings(): array
    {
        // Define the headers here
        return [
            'ID',
            'Empresa',
            'Nombre',
            'Apellido',
            'Limite de credito',
            'Credito disponible',
            'Credito usado vencido',
            'Credito usado no vencido',
            'Deuda',
        ];
    }
}
