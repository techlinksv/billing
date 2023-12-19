<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Credit;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CreditResource;
use Illuminate\Database\Eloquent\Builder;

class CreditController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CreditResource::collection(Credit::when(request()->order_id,
        function (Builder $query, string $order_id) {
            $query->where('order_id',$order_id);
        })
        ->when(request()->from,
        function (Builder $query, string $from) {
            $query->whereDate('created_at','>=',$from);
        })
        ->when(request()->state,
        function (Builder $query, string $state) {
            $query->where('state',$state);
        })
        ->when(request()->client_id,
        function (Builder $query, string $client_id) {
            $query->whereIn('order_id',Order::where('client_id',$client_id)->get()->pluck('id'));
        })
        ->when(request()->to,
        function (Builder $query, string $to) {
            $query->whereDate('created_at','<=',$to);
        }) 
        ->when(request()->expired,
        function (Builder $query) {
            $query->where('expire_at','<',\Carbon\Carbon::now());
        })
        //get only clients allowed for user
            ->paginate((request()->per_page)?request()->per_page:10
        ));
    }

    public function list()
    {
       return Credit::when(request()->order_id,
        function (Builder $query, string $order_id) {
            $query->where('order_id',$order_id);
        })
        ->when(request()->from,
        function (Builder $query, string $from) {
            $query->whereDate('created_at','>=',$from);
        })
        ->when(request()->client_id,
        function (Builder $query, string $client_id) {
            $query->whereIn('order_id',Order::where('client_id',$client_id)->get()->pluck('id'));
        })
        ->when(request()->state,
        function (Builder $query, string $state) {
            $query->where('state',$state);
        })
        ->when(request()->to,
        function (Builder $query, string $to) {
            $query->whereDate('created_at','<=',$to);
        })
        ->when(request()->expired,
        function (Builder $query) {
            $query->where('expire_at','<',\Carbon\Carbon::now());
        })
        ->orderBy('expire_at', 'asc')
        ->get()->map(function ($c) {
            return $c;
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric',
            'state' => 'required|in:activo,anulado',
            'order_id' => 'nullable|exists:orders,id',
            'expire_at' => 'required|date'
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $credit = new Credit();
        $credit->fill($request->all());
        $credit->save();

    
        return new CreditResource($credit);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new CreditResource(Credit::findOrFail($id));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $credit = Credit::findOrFail($id);
        if($credit){
            $credit->fill($request->all());
            $credit->save();
            return new CreditResource($credit);
        }
        return response()->json(['message'=> 'Crédito no encontrado'],401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
