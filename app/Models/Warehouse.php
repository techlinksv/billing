<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\CountryScope;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = ['name','country_id','bills_from','bills_to','bills_counter'];
    
    protected static function booted()
    {
        // Add the CountryScope to the model's global scopes
        static::addGlobalScope(new CountryScope());
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }
}
