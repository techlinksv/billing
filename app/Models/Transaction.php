<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\CountryScope;

class Transaction extends Model
{
    use HasFactory;

    protected $casts = [
        'date' => 'date',
    ];

    protected $fillable = [
        'country_id',
        'category_id',
        'amount',
        'type',
        'method',
        'check_number',
        'bank',
        'date',
        'reason',
    ];

    protected static function booted()
    {
        // Add the CountryScope to the model's global scopes
        static::addGlobalScope(new CountryScope());
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
