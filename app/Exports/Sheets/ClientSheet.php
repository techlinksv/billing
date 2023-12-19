<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromCollection;
use App\Models\Client;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Http\Resources\ClientResource;

class ClientSheet implements FromCollection, WithTitle, ShouldAutoSize, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */

    private $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function collection()
    {
        return ClientResource::collection(collect([$this->client]));
    }

     /**
     * @return string
     */
    public function title(): string
    {
        return 'Cliente';
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nombre',
            'Apellido',
            'Teléfono',
            'Email',
            'Documento 1',
            'Documento 2',
            'Documento 3',
            'Comentarios',
            'Fecha de eliminación',
            'Fecha de creación',
            'Fecha de actualización',
            'País',
            'Límite de crédito',
            'Compañía',
            'Teléfono 2',
            'Dirección',
            'Deuda',
            'Crédito disponible',
            'Crédito usado vencido',
        ];
    }
}
