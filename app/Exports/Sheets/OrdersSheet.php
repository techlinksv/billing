<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Models\Client;
use App\Http\Resources\OrderResource;

class OrdersSheet implements FromCollection, WithTitle, ShouldAutoSize, WithHeadings
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
        return $this->client->orders()->with(['credit'])->get()->map(
            function ($order){
                return (object)[
                    'ID Factura' => $order->id,
                    'Numero de Factura' => $order->bill_number,
                    'Tipo de pago' => $order->payment_type,
                    'Fecha de creación' => $order->created_at,
                    'Fecha de vencimiento' => $order?->credit?->first()?->expire_at,
                    'Total' => $order->total,
                    'Deuda' => $order?->credit?->first()?->debt,
                ];
            }
        );
    }

         /**
     * @return string
     */
    public function title(): string
    {
        return 'Facturas';
    }

    public function headings(): array
    {
        // Define the headers here
        return [
            'ID Factura',
            'Numero de Factura',
            'Tipo de pago',
            'Fecha de creación',
            'Fecha de vencimiento',
            'Total',
            'Deuda'
        ];
    }
}
