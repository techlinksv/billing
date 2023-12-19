<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use App\Models\Order;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class OrderExport implements FromView, ShouldAutoSize
{
    public function view(): View
    {
        return view('exports.order', [
            'order' => Order::findOrFail(request()->order_id)
        ]);
    }
}
