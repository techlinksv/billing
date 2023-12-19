<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Payment;
use App\Models\Credit;
use App\Models\Client;
use App\Http\Resources\PaymentResource;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
            ->paginate((request()->per_page)?request()->per_page:10)
        );
    }

     /**
     * Display a listing of the resource.
     */
    public function list()
    {
        return Payment::when(request()->credit_id,
        function (Builder $query, string $credit_id) {
            $query->where('credit_id',$credit_id);
        })
        ->when(request()->client_id, function (Builder $query, $client_id) {
            $query->whereHas('credit.order', function (Builder $orderQuery) use ($client_id) {
                $orderQuery->where('client_id', $client_id);
            });
        })
        ->when(request()->from,
        function (Builder $query, string $from) {
            $query->whereDate('created_at','>=',$from);
        })
        ->when(request()->to,
        function (Builder $query, string $to) {
            $query->whereDate('created_at','<=',$to);
        })->orderBy('created_at','desc')->get()->map(function ($p) {
            return $p;
        });
    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric',
            'credit_id' => 'required|exists:credits,id',
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $credit = Credit::find($request->credit_id);
        if($request->amount > $credit->debt){
            return response()->json(['errors'=>['amount' => 'El abono es mayor a la deuda de: '.$credit->debt]],400);
        }

        $payment = new Payment();
        $payment->fill($request->all());
        $payment->save();
        return new PaymentResource($payment);
    }

    public function pay(Request $request){
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric',
            'client_id' => 'required|exists:clients,id',
        ]);

        $client = Client::find($request->client_id);
        if($request->amount > $client->debt){
            return response()->json(['errors'=>['amount' => 'La deuda total es de: '.$client->debt]],400);
        }

        $user = \App\Models\User::find(auth()->id());
 
        $credits = $client->credits()->where('credits.state','activo')->orderBy('expire_at', 'asc')->get();
        $amount = $request->amount;
        $payment_number = $user->payments_counter;
        $user->payments_counter = $user->payments_counter + 1;
        foreach($credits as $credit){
            if($amount > 0){
                $pay = 0;
                if($credit->debt > $amount){
                    $pay = $amount;
                    $amount = 0;
                }else{
                    $pay = $credit->debt;
                    $amount = $amount - $credit->debt;
                }
                $payment = new Payment([
                    'credit_id' => $credit->id,
                    'amount' => $pay,
                    'comments' => $request->comments,
                    'bill_number' => $payment_number,
                ]);
                $payment->save();
            }
        }
        $user->save();

        return response()->json(['status'=>'success']);


    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new PaymentResource(Payment::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $payment = Payment::findOrFail($id);
        if($payment){
            $payment->delete();
            return response()->json(['message'=> 'Pago borrado exitosamente']);
        }
        return response()->json(['message'=> 'Pago no encontrado'],401);
    }
}
