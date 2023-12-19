<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Item;
use App\Models\Batch;
use App\Models\Client;
use App\Models\Credit;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Builder;
use App\Exports\OrderExport;
use Maatwebsite\Excel\Facades\Excel;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return OrderResource::collection(Order::when(request()->search,
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
        ->orderBy('created_at','desc')
        //->where('client_id',Client::all()->pluck('id')) 
        // get only orders from visible clients country filter
        ->paginate((request()->per_page)?request()->per_page:10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
           // TODO
           $validator = Validator::make($request->all(), [
            'client_company' => 'nullable|max:255',
            'client_first_name' => 'required|max:255',
            'client_last_name' => 'nullable|max:255',
            'client_document_1' => 'nullable|max:255',
            'client_document_2' => 'nullable',
            'payment_type' => 'required|in:credito,efectivo',
            'comments' => 'nullable|max:255',
            'client_id' => 'nullable|exists:clients,id',
            'warehouse_id' => 'required|exists:warehouses,id', //required to know witch batch will be used
            'credit_date' => 'required_if:payment_type,credito|date', //required if is credit
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric',
            'items.*.price' => 'required|numeric',
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }
        $order = new Order();
        $order->fill($request->all());
        //dd($order);
        $order->save();
        
        $items = [];
        
        $total = 0.00;
        if($request->debt){
            $total = $request->debt;
        }
        //batch validation
        foreach($request->items as $item){

            //dd($item);
            //batch validation
            $batch = Batch::where('product_id',$item['product_id'])
            ->where('warehouse_id',$request->warehouse_id)->first();
            if(!$batch || ($batch->quantity < $item['quantity'])){
                 return response()->json(['errors'=>['items' => 'Insuficiente']],400);
            }
            $new_item = new Item();
            $new_item->batch_id = $batch->id;
            $new_item->order_id = $order->id;
            $new_item->cost = $batch?->product?->price;
            $new_item->quantity = $item['quantity'];
            $new_item->price = $item['price'];
            $items[] = $new_item;
            $total = $total + ($item['quantity'] * $item['price']);
        }

        //credit logic
        if($request->payment_type == 'credito'){
            $client = Client::find($request->client_id);
            if(($client->available_credit() - $total) < 0.00){
                $order->state = 'anulado';
                $order->save();
                return response()->json(['errors'=>['client_id' => 'Crédito insuficiente']],400);
            }
            //iva and tax logic
            $iva = ($order->has_iva)?$total * $order->iva:0;
            $tax = ($order->has_tax)?($total + $iva) * $order->taxes:0;
            //


            $credit = new Credit();
            $credit->amount = $total + $iva + $tax;
            $credit->expire_at = $request->credit_date;
            $credit->state = 'activo';
            $credit->comments = ($request->debt)?'Deuda Inicial del cliente':'Credito de compra para orden '.$order->id;
            $credit->order_id = $order->id;
            $credit->save();
        }

        foreach($items as $it){ //saving and moving inventory
            $it->save();
        }

        return new OrderResource($order);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new OrderResource(Order::findOrFail($id));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::findOrFail($id);
        if($order){
            $order->fill($request->all());
            $order->save();
            return new OrderResource($order);
        }
        return response()->json(['message'=> 'Factura no encontrado'],401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        if($order){
            $order->delete();
            return response()->json(['message'=> 'Factura borrada exitosamente']);
        }
        return response()->json(['message'=> 'Factura no encontrada'],401);
    }


    public function export(Request $request){
        return Excel::download(new OrderExport, 'factura_'.$request->order_id.'.xlsx');
    }

    
}
