<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\WarehouseResource;
use App\Models\Warehouse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\Eloquent\Builder;

class WarehouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new WarehouseResource(Warehouse::when(auth()?->user()?->warehouse_id,function (Builder $query, $warehouse_id) {
            $query->where('id',$warehouse_id);
        })->orderBy('id','asc')->get());

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'country_id' => 'required|exists:countries,id',
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $warehouse = new Warehouse();
        $warehouse->fill($request->all());
        $warehouse->save();
        return new WarehouseResource($warehouse);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new WarehouseResource(Warehouse::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $warehouse = Warehouse::findOrFail($id);
        if($warehouse){
            $warehouse->fill($request->all());
            
            return new WarehouseResource($warehouse);
        }
        return response()->json(['message'=> 'Bodega no encontrada']);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $warehouse = Warehouse::findOrFail($id);
        if($warehouse){
            $warehouse->delete();
            return response()->json(['message'=> 'Bodega borrada exitosamente']);
        }
        return response()->json(['message'=> 'Bodega no encontrada']);

    }
}
