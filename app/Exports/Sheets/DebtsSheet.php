<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Models\Client;
use App\Http\Resources\DebtsReportResource;

class DebtsSheet implements FromCollection, WithTitle, ShouldAutoSize, WithHeadings
{
    private $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return collect($this->client->credits()->where('credits.state','activo')->get()
            ->map(function ($credit){
                return (object)[
                    'ID Factura' => $credit->order_id,
                    'Fecha de creación' => $credit->created_at,
                    'Fecha de vencimiento' => $credit->expire_at,
                    'Monto' => $credit->amount,
                    'Deuda' => $credit->debt,
                    'Pagado' => $credit->paid,
                    'Esta vencido' => ($credit->isExpired)? 'Si' : 'No',
                ];
            })
        );
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Deudas';
    }

    public function headings(): array
    {
        // Define the headers here
        return [
            'ID Factura',
            'Fecha de creación',
            'Fecha de vencimiento',
            'Monto',
            'Deuda',
            'Pagado',
            'Esta vencido'
        ];
    }
}
