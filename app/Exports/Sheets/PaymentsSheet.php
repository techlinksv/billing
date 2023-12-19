<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Models\Client;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Builder;

class PaymentsSheet implements FromCollection, WithTitle, ShouldAutoSize, WithHeadings
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
        $payments = Payment::whereIn('credit_id', $this->client->credits()->pluck('credits.id'))->get();

        return $payments->map(
            function ($payment){
                return [
                    'ID' => $payment->id,
                    'ID Pago' => $payment->bill_number,
                    'ID Factura' => $payment->order_id,
                    'Usuario' => $payment->user->name,
                    'Numero de Factura' => $payment?->credit?->order?->bill_number,
                    'Fecha de creación' => $payment->created_at,
                    'Total' => $payment->amount,
                    'Comentarios' => $payment->comments,
                ];
            }
        );
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Pagos';
    }

    public function headings(): array
    {
        // Define the headers here
        return [
            'ID',
            'ID Pago',
            'ID Factura',
            'Usuario',
            'Numero de Factura',
            'Fecha de creación',
            'Total',
            'Comentarios'
        ];
    }
}
