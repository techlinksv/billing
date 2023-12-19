<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CountryResource;
use App\Models\Country;
use Illuminate\Support\Facades\Validator;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new CountryResource(Country::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'country' => 'required|max:255',
            'country_code' => 'required|max:255',
            'country_currency' => 'required|max:255',
            'document_1' => 'required|max:255',
        ]);
 
        if($validator->fails()){
            return response()->json(['errors'=>$validator->getMessageBag()],400);
        }

        $country = new Country();
        $country->fill($request->all());
        $country->save();
        return new CountryResource($country);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new CountryResource(Country::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $country = Country::findOrFail($id);
        if($country){
            $country->fill($request->all());
            $country->save();
            return new CountryResource($country);
        }
        return response()->json(['message'=> 'País no encontrado'],401);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $country = Country::findOrFail($id);
        if($country){
            $country->delete();
            return response()->json(['message'=> 'País borrado exitosamente']);
        }
        return response()->json(['message'=> 'País no encontrado'],401);
    }
}
