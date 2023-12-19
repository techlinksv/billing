<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\CountryScope;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Client extends Model
{
    use HasFactory;

    // Define the default sort order
    public static $defaultSort = [
        'id' => 'asc', // or 'desc'
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'phone',
        'email',
        'document_1',
        'document_2',
        'document_3',
        'comments',
        'country_id',
        'credit_limit',
        'company',
        'address',
        'phone_2'
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

    public function transactions()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function available_credit(){
        
        return $this->credit_limit - $this->used_credit();
    }

    public function used_credit(){
        $active_credits = $this->credits()->where('credits.state','activo')->get();
        $debt = 0.00;
        foreach($active_credits as $credit){
            $debt = $debt + $credit->debt;
        }
        return round($debt,2);
    }

    public function used_credit_expired(){
        $active_credits = $this->credits()->where('credits.state','activo')->where('credits.expire_at','<',\Carbon\Carbon::now())->get();
        $debt = 0.00;
        foreach($active_credits as $credit){
            $debt = $debt + $credit->debt;
        }
        return round($debt,2);
    }

    public function credits()
    {
        return $this->hasManyThrough(Credit::class,Order::class);
    }

    protected function debt(): Attribute
    {
        return new Attribute(
            get: fn () => $this->used_credit(),
        );
    }

    protected function debt_expired(): Attribute
    {
        return new Attribute(
            get: fn () => $this->used_credit_expired(),
        );
    }
}
