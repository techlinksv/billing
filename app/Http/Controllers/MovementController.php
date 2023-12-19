<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movement;
use App\Models\Batch;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\User;
use App\Http\Resources\MovementResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\MovementsExport;

class MovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return MovementResource::collection(
            Movement::with(['user','batch','batch.product'])
                ->when(request()->search,
                function (Builder $query, string $search) {
                    $searchTerm = '%' . strtolower($search) . '%';
                    $users = User::whereRaw('LOWER(name) LIKE ?', [$searchTerm])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$searchTerm])
                        ->orWhereRaw('LOWER(type) LIKE ?', [$searchTerm]);
                })
                ->when(request()->type,function (Builder $query, string $type) {
                    $query->where('type',$type );
                })
                ->when(request()->warehouse_id,function (Builder $query, string $warehouse_id) {
                    $query->whereIn('batch_id',Batch::where('warehouse_id',$warehouse_id)->get()->pluck('id'));
                })
                ->when(request()->product_id,function (Builder $query, string $product_id) {
                    $query->whereIn('batch_id',Batch::where('product_id',$product_id)->get()->pluck('id'));
                })->orderBy('created_at','desc')
            ->paginate((request()->per_page)?request()->per_page:10));
    }

    public function export() 
    {
        return Excel::download(new MovementsExport, 'products.xlsx');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|numeric',
            'type' => 'required|in:entrada,salida',
            'batch_id' => 'nullable|exists:batches,id',
            'product_id' => 'required_without:batch_id|exists:products,id',
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $batch = Batch::find($request->batch_id);

        if(!$batch){
            $batch = new Batch();
            $batch->warehouse_id = $request->warehouse_id;
            $batch->product_id = $request->product_id;
            $batch->quantity = 0;
            $batch->save();
        }

        $movement = new Movement();
        $movement->fill($request->all());
        $movement->batch_id = $batch->id;
        $movement->save();

        if($request->movement_id){
            $mov = Movement::find($request->movement_id);
            $mov->canceled = true;
            $mov->save();
        }
        return new MovementResource($movement);
    }


      /**
     * Store a newly created resource in storage.
     */
    public function multipleStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'list.*.quantity' => 'required|numeric',
            'list.*.type' => 'required|in:entrada,salida',
            'list.*.product_id' => 'required_without:batch_id|exists:products,id',
            'warehouse_id' => 'required|exists:warehouses,id'
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $list = [];
        $warehouse = Warehouse::find($request->warehouse_id);

        foreach($request->list as $itm){
            $item = (object) $itm;
            $batch = Batch::where('warehouse_id',$warehouse->id)
                            ->where('product_id',$item->product_id)
                            ->first();
            if(!$batch){
                $batch = new Batch();
                $batch->warehouse_id = $warehouse->id;
                $batch->product_id = $item->product_id;
                $batch->quantity = 0;
                $batch->save();
            }
    
            $movement = new Movement();
            $movement->movement_number = $warehouse->movements_counter;
            $movement->fill($itm);
            $movement->batch_id = $batch->id;
            $movement->save();
            array_push($list,$movement);
        }
        $warehouse->movements_counter = $warehouse->movements_counter + 1;
        $warehouse->save();

        return MovementResource::collection(collect($list));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new MovementResource(Movement::findOrFail($id));
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
        //
    }
}
