<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ReportEarningResource;
use App\Http\Resources\DebtsReportResource;
use App\Http\Resources\SalesReportResource;
use App\Http\Resources\ProductSalesResource;
use App\Http\Resources\UserResource;
use App\Models\Product;
use App\Models\Payment;
use App\Models\Warehouse;
use App\Models\Batch;
use App\Models\Order;
use App\Models\Credit;
use App\Models\User;
use App\Models\Client;
use App\Models\Item;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\EarningsExport;
use App\Exports\DebtsExport;
use App\Exports\UserExport;
use App\Exports\ProductBatchExport;
use App\Exports\AllDebtsExport;



class ReportController extends Controller
{
    public function batches(){
        return ProductResource::collection(Product::when(request()->search,
        function (Builder $query, string $search) {
           $searchTerm = '%' . strtolower($search) . '%';
           $query->whereRaw('LOWER(sku) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(name) LIKE ?', [$searchTerm]);
            })->orderBy('created_at','desc')->paginate(
                (request()->per_page)?request()->per_page:10
        ));
    }

    public function batchesTotal(){
        $products = ProductResource::collection(Product::when(request()->search,
        function (Builder $query, string $search) {
           $searchTerm = '%' . strtolower($search) . '%';
           $query->whereRaw('LOWER(sku) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(name) LIKE ?', [$searchTerm]);
            })->orderBy('created_at','desc')->get())->collection;
        
        $total = 0;
        foreach($products as $p){
            $d = json_decode($p->toJson());
            $total = $total + $d->total;
        }
        return [
            "count" => $products->count(),
            "total" => $total
        ];
    }

    public function batchesReport(){

    }

    public function benefits(){
        return
        ReportEarningResource::collection(Item::join('batches', 'items.batch_id', '=', 'batches.id')
                ->join('products', 'batches.product_id', '=', 'products.id')
                ->join('orders', 'items.order_id', '=', 'orders.id')
                ->where('orders.state', '=', 'activo')
                ->when(request()->warehouse_id,
                function (Builder $query, string $warehouse_id) {
                    $query->where('batches.warehouse_id',$warehouse_id);
                })
                ->when(request()->product_id,
                function (Builder $query, string $product_id) {
                    $query->where('batches.product_id',$product_id);
                })
                ->when(request()->from,
                function (Builder $query, string $from) {
                    $query->where('orders.created_at','>=',$from);
                })
                ->when(request()->to,
                function (Builder $query, string $to) {
                    $query->where('orders.created_at','<=',$to);
                })

                ->select('products.name as product_name', 
                        'products.sku', // Include SKU in the select
                        'items.price',
                        'items.cost',
                        \DB::raw('SUM(items.quantity) as total_units'),
                        \DB::raw('SUM(items.quantity * (items.price - items.cost)) as total_earnings'))
                ->groupBy('products.name','products.sku' ,'items.price', 'items.cost')->paginate(
                    (request()->per_page)?request()->per_page:10
                ));
    }
       

    public function benefitsTotal(){
        $itemData = ReportEarningResource::collection(Item::join('batches', 'items.batch_id', '=', 'batches.id')
            ->join('products', 'batches.product_id', '=', 'products.id')
            ->join('orders', 'items.order_id', '=', 'orders.id')
            ->where('orders.state', '=', 'activo')
            ->when(request()->warehouse_id,
            function (Builder $query, string $warehouse_id) {
                $query->where('batches.warehouse_id',$warehouse_id);
            })
            ->when(request()->product_id,
            function (Builder $query, string $product_id) {
                $query->where('batches.product_id',$product_id);
            })
            ->when(request()->from,
            function (Builder $query, string $from) {
                $query->where('orders.created_at','>=',$from);
            })
            ->when(request()->to,
            function (Builder $query, string $to) {
                $query->where('orders.created_at','<=',$to);
            })

            ->select('products.name as product_name', 
                    'products.sku', // Include SKU in the select
                    'items.price',
                    'items.cost',
                    \DB::raw('SUM(items.quantity) as total_units'),
                    \DB::raw('SUM(items.quantity * (items.price - items.cost)) as total_earnings'))
            ->groupBy('products.name','products.sku' ,'items.price', 'items.cost')->get())->collection;
        
       // dd($itemData);
        
        return [
            'total_earnings' => $itemData->sum('total_earnings')
        ];
    }

    public function benefitsReport(){
        return Excel::download(new EarningsExport, 'ganancias.xlsx');

    }

    public function debts(){
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
            ->orderBy('created_at')
            ->paginate(
                (request()->per_page)?request()->per_page:10
            )
        );
    }

    public function debtsTotal(){
        $credit = DebtsReportResource::collection(
            Credit::with(['order','order.client','payments'])
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
            ->orderBy('created_at')->get())->collection->map(
                function($c){
                    return json_decode($c->toJson()); //force resource mapping
                }
            );
        return [
            'pending' => $credit->sum('debt'),
            'pending_expired' => $credit->where('expired',true)->sum('debt'),
            'paid' => $credit->sum('paid')
        ];
    }

    public function debtsReport(){
        return Excel::download(new DebtsExport, 'deudas.xlsx');

    }

    public function sales(){
        return SalesReportResource::collection(
            Item::with(['order','order.user','batch','batch.product'])
            ->when(request()->user_id, function (Builder $query, $user_id) {
                $query->whereHas('order', function (Builder $q) use ($user_id) {
                    $q->where('user_id', $user_id);
                });
            })   
            ->when(request()->from, function (Builder $query, $from) {
                $query->whereDate('created_at', '>=', $from);
            })
            ->when(request()->to, function (Builder $query, $to) {
                $query->whereDate('created_at', '<=', $to);
            })
            ->orderBy('created_at')
            ->paginate(
                (request()->per_page)?request()->per_page:10
            )
        );
    }
    public function salesTotal(){
        /*
        $sales = SalesReportResource::collection(
            Item::with(['order','order.user','batch','batch.product'])
            ->when(request()->user_id, function (Builder $query, $user_id) {
                $query->whereHas('order', function (Builder $q) use ($user_id) {
                    $q->where('user_id', $user_id);
                });
            })   
            ->when(request()->from, function (Builder $query, $from) {
                $query->whereDate('created_at', '>=', $from);
            })
            ->when(request()->to, function (Builder $query, $to) {
                $query->whereDate('created_at', '<=', $to);
            })
            ->orderBy('created_at')
            ->get())
            
            ->collection->map(
                function($c){
                    \Log::info('============= object =============');
                    \Log::info($c->toJson());
                    $obj =  json_decode($c->toJson()); //force resource mapping
                    $obj->total_cost = $c->totalCost;
                    $obj->total_price= $c->total +  $c->totalIva + $c->tax;
                    return $obj;
                });  


        */
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
            return [
                'total' => null,
                'total_cost' => null,
                'total_credito' => null,
                'total_efectivo' => null,
                'total_anulado' => null,
                'total_pagos' => null,
                'total_pagos_anulados' => null,
            ];
        }

        return [
            
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

    public function userReport(){
        return Excel::download(new UserExport,'reporte_usuario.xlsx');
    }
    public function users(){
        return UserResource::collection(User::when(request()->country_id, function (Builder $query, $country_id) {
            $query->where('country_id', $country_id);
        })
        ->when(request()->warehouse_id, function (Builder $query, $warehouse_id) {
            $query->where('warehouse_id', $warehouse_id);
        })->orderBy('id','asc')->get());
    }

    public function products()
    {
        $products =
        ProductSalesResource::collection(
            Product::with(['batches.items.order' => function ($query) {
                $query->where('state', 'activo');
            }])
            ->get()
            ->map(function ($product) {
                $batches = $product->batches;
                if(request()->warehouse_id){
                    $batches = $batches->where('warehouse_id',request()->warehouse_id);
                }
                $product->quantity = $batches->sum(function ($batch) {
                    $items = $batch->items; 
                    if(request()->from){
                        $items = $items->where('created_at','>=',request()->from);
                    }
                    if(request()->to){
                        $items = $items->where('created_at','<=',request()->to);
                    }

                    return $items->sum('quantity');
                });

                $product->sales = $batches->sum(function ($batch) {
                    $items = $batch->items; 
                    if(request()->from){
                        $items = $items->where('created_at','>=',request()->from);
                    }
                    if(request()->to){
                        $items = $items->where('created_at','<=',request()->to);
                    }
                    return $batch->items->sum('quantity') * $batch->items->sum('price');
                });
        
                $product->cost = $batches->sum(function ($batch) {
                    $items = $batch->items; 
                    if(request()->from){
                        $items = $items->where('created_at','>=',request()->from);
                    }
                    if(request()->to){
                        $items = $items->where('created_at','<=',request()->to);
                    }
                    return $items->sum('quantity') * $items->sum('cost');
                });
                    unset($product->batches);
                    return $product;
                })->sortByDesc('quantity')
            );
        return $products;
    }

    public function productsReport(){
        return Excel::download(new ProductBatchExport, 'deudas.xlsx');

    }
    
    public function clientReport(){
        $client = Client::find(request()->client_id);
        if($client){
            return Excel::download(new AllDebtsExport($client), 'client.xlsx');
        }
        return response()->json(['message' => 'Cliente no encontrado'],404);
    }
    
}
