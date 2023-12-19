<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\CountryScope;

class Category extends Model
{
    use HasFactory;

    protected static function booted()
    {
        // Add the CountryScope to the model's global scopes
        static::addGlobalScope(new CountryScope());
    }


    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
