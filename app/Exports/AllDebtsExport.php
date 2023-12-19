<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Models\Client;
use App\Exports\Sheets\DebtsSheet;
use App\Exports\Sheets\ClientSheet;
use App\Exports\Sheets\OrdersSheet;
use App\Exports\Sheets\PaymentsSheet;

class AllDebtsExport implements WithMultipleSheets
{
    use Exportable;

    protected $client;
    
    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * @return array
     */
    public function sheets(): array
    {
        return [
            'Client' => new ClientSheet($this->client),
            'Debts' => new DebtsSheet($this->client),
            'Orders' => new OrdersSheet($this->client),
            'Payments' => new PaymentsSheet($this->client),
        ];
    }
}
