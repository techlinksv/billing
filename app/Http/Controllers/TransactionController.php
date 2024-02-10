<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Models\Client;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\Eloquent\Builder;
use App\Exports\TransactionsExport;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TransactionResource::collection(
            Transaction::with(['category','user'])->when(request()->type,
                function (Builder $query, $type) {
                    $query->where('type',$type);
                })
                ->when(request()->search, function (Builder $query, $search) {
                    // Use whereHas to apply conditions on the related Category model
                    $query->whereHas('category', function ($query) use ($search) {
                        // Use 'like' operator for case-insensitive search
                        $query->where('category', 'like', '%' . $search . '%');
                    });
                })
                ->when(request()->method,
                function (Builder $query, $method) {
                    $query->where('method',$method);
                })
                ->when(request()->from,
                function (Builder $query, $from) {
                    $query->where('date','>=',$from);
                })
                ->when(request()->to,
                function (Builder $query, $to) {
                    $query->where('date','<=',$to);
                })->orderBy('date','desc')
                ->paginate( 
                (request()->per_page)?request()->per_page:10
            ));
    }

    public function export(){
        return Excel::download(new TransactionsExport, 'deudas.xlsx');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country_id' => 'required|exists:countries,id',
            'category_id' => 'required|exists:categories,id',
            'amount'=> 'required|numeric',
            'type' => ['required', 'in:ingreso,egreso'],
            'method' => ['required', 'in:efectivo,cheque'],
        ]);



 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $transaction = new Transaction();
        $transaction->fill($request->all());
        $transaction->user_id = auth()?->id();
        $transaction->save();
        return new TransactionResource($transaction);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new TransactionResource(Transaction::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);
        if($transaction){
            $transaction->fill($request->all());
            $transaction->save();
            return new TransactionResource($transaction);
        }
        return response()->json(['message'=> 'Transacción no encontrado'],401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $transaction = Transaction::findOrFail($id);
        if($transaction){
            $transaction->delete();
            return response()->json(['message'=> 'Transacción borrada exitosamente']);
        }
        return response()->json(['message'=> 'Transacción no encontrada']);
    }
}
