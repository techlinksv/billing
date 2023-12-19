<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Batch;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Builder;
use App\Imports\ExcelProductImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductsExport;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProductResource::collection(Product::when(request()->search,
        function (Builder $query, string $search) {
           $searchTerm = '%' . strtolower($search) . '%';
           $query->whereRaw('LOWER(sku) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(name) LIKE ?', [$searchTerm]);
            })->orderBy('created_at','desc')->paginate(
                (request()->per_page)?request()->per_page:10
        ));
    }


    public function list()
    {
        return Product::when(request()->search,
        function (Builder $query, string $search) {
           $searchTerm = '%' . strtolower($search) . '%';
           $query->whereRaw('LOWER(sku) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(name) LIKE ?', [$searchTerm]);
            })->orderBy('created_at','desc')->get()->map(function ($p) {
                $quantity = (request()->warehouse_id)?
                Batch::where('warehouse_id',request()->warehouse_id)->where('product_id',$p->id)->first()?->quantity
                :null;
                return (object)[
                    'id' => $p->id,
                    'sku' => $p->sku,
                    'name' => $p->name,
                    'quantity' => $quantity,
                    'units' => $p->units,
                ];
            });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'sku' => 'required|unique:products,sku',
            'size' => 'max:255',
            'units' => 'max:255',
            'country_id' => 'required|exists:countries,id',
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $product = new Product();
        $product->fill($request->all());
        $product->save();

        if($request->quantity){
            $batch = new Batch();
            $batch->product_id = $product->id;
            $batch->warehouse_id = $request->warehouse_id;
            $batch->quantity = $request->quantity;
            $batch->save();
        }
        return new ProductResource($product);
    }

    //

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new ProductResource(Product::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        if($product){
            $product->fill($request->all());
            $product->save();
            if($request->warehouse_id){
                $batch = Batch::where('warehouse_id',$request->warehouse_id)->where('product_id',$product->id)->first();
                if($batch == null){
                    $batch = new Batch();
                    $batch->product_id = $product->id;
                    $batch->warehouse_id = $request->warehouse_id;
                }
                $batch->quantity = $request->quantity;
                $batch->save();
            }
            return new ProductResource($product);
        }
        return response()->json(['message'=> 'Producto no encontrado'],401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        if($product){
            $product->delete();
            return response()->json(['message'=> 'Producto borrado exitosamente']);
        }
        return response()->json(['message'=> 'Producto no encontrado'],401);
    }

    public function import(){
        try{
            Excel::import(new ExcelProductImport, request()->file('file'));
        }catch(\Exception $ex){
            \Log::error($ex);
        }
        return response()->json(['message'=> 'Lista importada exitosamente'],200);
    }

    public function export() 
    {
        return Excel::download(new ProductsExport, 'products.xlsx');
    }

}
