<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;


    protected $fillable = [
        'country',
        'country_code',
        'currency',
        'document_1',
        'document_2',
        'document_3',
        'comments',
    ];

    public function users()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->belongsTo(Product::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }
    
}
