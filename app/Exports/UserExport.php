<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use App\Models\Item;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\SalesReportResource;

use Illuminate\Database\Eloquent\Builder;

class UserExport implements FromView, ShouldAutoSize
{
    public function view(): View
    {
        $orders = $this->orders();
        $payments = $this->payments();
        $totals = $this->totals();
        $user = User::find(request()->user_id);
     
        return view('exports.user', [
            'orders' => $orders,
            'payments' => $payments,
            'totals' => $totals,
            'user' => $user,
            'from' => request()->from,
            'to' => request()->to,
        ]);
    }


    protected function orders(){
        return OrderResource::collection(Order::when(request()->search,
        function (Builder $query, string $search) {
           $searchTerm = '%' . strtolower($search) . '%';
           $query->whereRaw('LOWER(client_company) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(client_first_name) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(client_last_name) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(client_document_1) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(client_document_2) LIKE ?', [$searchTerm])
               ->orWhereRaw('bill_number', [$searchTerm]);

       })
       ->when(request()->client_id,
       function (Builder $query, string $client_id) {
           $query->where('client_id',$client_id);
       })
       ->when(request()->user_id,
       function (Builder $query, string $user_id) {
           $query->where('user_id',$user_id);
       })
       ->when(request()->payment_type,
       function (Builder $query, string $payment_type) {
           $query->where('payment_type',$payment_type);
       })
       ->when(request()->warehouse_id,
       function (Builder $query, string $warehouse_id) {
           $query->whereHas('items', function ($q) use ($warehouse_id) {
               $q->whereHas('batch', function ($qr) use ($warehouse_id) {
                   $qr->where('warehouse_id', $warehouse_id);
               });
           });
       })
       ->when(request()->from,
       function (Builder $query, string $from) {
           $query->whereDate('created_at','>=',$from);
       })
       ->when(request()->to,
       function (Builder $query, string $to) {
           $query->whereDate('created_at','<=',$to);
       })
       ->orderBy('created_at','desc')
       //->where('client_id',Client::all()->pluck('id')) 
       // get only orders from visible clients country filter
       ->get())->collection->map(
        function($c){
            return json_decode($c->toJson()); //force resource mapping
        }
        );
    }

    protected function payments(){
        return PaymentResource::collection(Payment::with(['credit','credit.order','credit.order.client'])
        ->when(request()->credit_id,
        function (Builder $query, string $credit_id) {
            $query->where('credit_id',$credit_id);
        })
        ->when(request()->client_id, function (Builder $query, $client_id) {
            $query->whereHas('credit.order', function (Builder $orderQuery) use ($client_id) {
                $orderQuery->where('client_id', $client_id);
            });
        })
        ->when(request()->user_id,
        function (Builder $query, string $user_id) {
            $query->where('user_id',$user_id);
        })
        ->when(request()->from,
        function (Builder $query, string $from) {
            $query->whereDate('created_at','>=',$from);
        })
        ->when(request()->to,
        function (Builder $query, string $to) {
            $query->whereDate('created_at','<=',$to);
        })
        ->when(request()->cancelled,
        function (Builder $query) {
            $query->withTrashed();
        })
        ->orderBy('created_at','desc') //get only clients allowed for user
        ->get()
        )->collection->map(
            function($c){
                return json_decode($c->toJson()); //force resource mapping
            }
        );
    }

    protected function totals(){
        $sales = Order::when(request()->search,
        function (Builder $query, string $search) {
           $searchTerm = '%' . strtolower($search) . '%';
           $query->whereRaw('LOWER(client_company) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(client_first_name) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(client_last_name) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(client_document_1) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(client_document_2) LIKE ?', [$searchTerm]);
               if(is_numeric($search)){
                   $query->orWhere('bill_number', $search);
               }
            })
            ->when(request()->client_id,
            function (Builder $query, string $client_id) {
                $query->where('client_id',$client_id);
            })
            ->when(request()->user_id,
            function (Builder $query, string $user_id) {
                $query->where('user_id',$user_id);
            })
            ->when(request()->payment_type,
            function (Builder $query, string $payment_type) {
                $query->where('payment_type',$payment_type);
            })
            ->when(request()->warehouse_id,
            function (Builder $query, string $warehouse_id) {
                $query->whereHas('items', function ($q) use ($warehouse_id) {
                    $q->whereHas('batch', function ($qr) use ($warehouse_id) {
                        $qr->where('warehouse_id', $warehouse_id);
                    });
                });
            })
            ->when(request()->from,
            function (Builder $query, string $from) {
                $query->whereDate('created_at','>=',$from);
            })
            ->when(request()->to,
            function (Builder $query, string $to) {
                $query->whereDate('created_at','<=',$to);
            })
            ->orderBy('created_at','desc')->get();

       
        
        // *************** Payments logic ***********************

        $payments = Payment::withTrashed()->when(request()->from, function (Builder $query, $from) {
            $query->whereDate('created_at', '>=', $from);
        })
        ->when(request()->to, function (Builder $query, $to) {
            $query->whereDate('created_at', '<=', $to);
        })->when(request()->user_id, function (Builder $query, $user_id) {
            $query->where('user_id', $user_id);
        })->get();

        if( ($user = User::find(request()->user_id)) && ($user->country_id == null)){
            return (object)[
                'total' => null,
                'total_cost' => null,
                'total_credito' => null,
                'total_efectivo' => null,
                'total_anulado' => null,
                'total_pagos' => null,
                'total_pagos_anulados' => null,
            ];
        }
                
        return (object)[
            'total' => $sales->whereNull('deleted_at')
                        ->where('state','activo')->sum('totalWithTax'),
            'total_cost' => $sales->whereNull('deleted_at')
                        ->where('state','activo')->sum('totalCost'),
            'total_credito' => $sales->whereNull('deleted_at')
                        ->where('payment_type','credito')
                        ->where('state','activo')->sum('totalWithTax'),
            'total_efectivo' => $sales->whereNull('deleted_at')
                        ->where('payment_type','efectivo')
                        ->where('state','activo')->sum('totalWithTax'),
            'total_anulado' => $sales->whereNotNull('deleted_at')
                        ->where('state','activo')->sum('total'),
                        
            'total_pagos' => $payments->whereNull('deleted_at')->sum('amount'),
            'total_pagos_anulados' => $payments->whereNotNull('deleted_at')->sum('amount'),
        ];
    }
}
