<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\ClientResource;
use App\Http\Resources\CreditResource;
use App\Http\Resources\ClientDebtsResource;
use App\Models\Client;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Builder;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ClientResource::collection(Client::when(request()->search,
         function (Builder $query, string $search) {
            $searchTerm = '%' . strtolower($search) . '%';
            $query->whereRaw('LOWER(first_name) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(last_name) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(company) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(email) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(document_1) LIKE ?', [$searchTerm]);
        })->paginate((request()->per_page)?request()->per_page:10));
    }

    public function count()
    {
        return Client::when(request()->country_id,function (Builder $query, string $country_id) {
            $query->where('country_id', $country_id);
        })->count();
    }

       /**
     * Display a listing of the resource.
     */
    public function list()
    {
        return Client::with(['credits'])->when(request()->search,
         function (Builder $query, string $search) {
            $searchTerm = '%' . strtolower($search) . '%';
            $query->whereRaw('LOWER(first_name) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(last_name) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(company) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(email) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(document_1) LIKE ?', [$searchTerm]);
        })->get()->map(function ($c){
            return (object)[
                "id" => $c->id,
                "company" => $c->company,
                "first_name" => $c->first_name,
                "last_name" => $c->last_name,
                "document_1" => $c->document_1,
                "document_2" => $c->document_2,
                "credit_limit" => $c->credit_limit,
                "active_credits_count" => $c->credits->where('state','activo')->count(),
                "due_credits" => $c->credits->where('state','activo')->where('expire_at','<',\Carbon\Carbon::now())->count(),
                "active_credits" => CreditResource::collection($c->credits->where('state','activo')->sortBy('expire_at')),
                "available_credit" => $c->available_credit(),
                "country_id" => $c->country_id,
            ];
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // TODO
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'document_1' => 'required|max:255',
            'document_2' => 'max:255',
            'document_3' => 'max:255',
            'comments' => 'max:255',
            'phone' => 'max:255',
            'email' => 'nullable|email',
            'country_id' => 'required|exists:countries,id',
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $client = new Client();
        $client->fill($request->all());
        $client->save();
        return new ClientResource($client);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new ClientResource(Client::findOrFail($id));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $client = Client::findOrFail($id);
        if($client){
            $client->fill($request->all());
            $client->save();
            return new ClientResource($client);
        }
        return response()->json(['message'=> 'Cliente no encontrado'],401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::findOrFail($id);
        if($client){
            $client->delete();
            return response()->json(['message'=> 'Cliente borrado exitosamente']);
        }
        return response()->json(['message'=> 'Cliente no encontrado']);
    }

    public function clientsDebts(){
        return ClientDebtsResource::collection(Client::when(request()->search,
        function (Builder $query, string $search) {
           $searchTerm = '%' . strtolower($search) . '%';
           $query->whereRaw('LOWER(first_name) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(last_name) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(company) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(email) LIKE ?', [$searchTerm])
               ->orWhereRaw('LOWER(document_1) LIKE ?', [$searchTerm]);
       })->paginate((request()->per_page)?request()->per_page:10));
    }

    public function clientsDebtsExport(){
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\ClientsDebtExport, 'clientes_deudas.xlsx');
    }
}
