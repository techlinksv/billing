<?php

namespace App\Imports;

use App\Models\Client;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ExcelClientsImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {

        $country_id = (auth('web')?->user()?->country_id) ? auth()?->user()?->country_id : request()->country_id;
        if(!$country_id){
            $country_id = $row['id_pais'];
        }
        $client = new Client([
            'company' => $row['local'],
            'first_name' => $row['nombres'],
            'last_name' => $row['apellidos'],
            'address' => $row['direccion'],
            'phone' => $row['telefono'],
            'document_1' => $row['nit'],
            'country_id' => $country_id,
            'comments' => '',
        ]);

        $client->save();
    }
}
