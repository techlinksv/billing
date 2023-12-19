<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    // Define the default sort order
    public static $defaultSort = [
        'id' => 'desc', // or 'asc'
    ];

    protected $fillable = [
        'client_id',
        'client_company',
        'client_first_name',
        'client_last_name',
        'client_document_1',
        'client_document_2',
        'payment_type',
        'state',
        'comments',
        'country_id',
        'bill_number',
        'has_tax',
        'has_iva',
    ];

    protected $attributes = [
        'state' => 'activo'
    ];

    protected $casts = [
        'expire_at' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function credit()
    {
        return $this->hasMany(Credit::class);
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }


    protected function total(): Attribute
    {
        return new Attribute(
            get: fn () => ($this->items)?$this->items->sum('total'):0.00,
        );
    }

    protected function cost(): Attribute
    {
        return new Attribute(
            get: fn () => ($this->items)?$this->items->sum('totalCost'):0.00,
        );
    }

    protected function tax(): Attribute
    {
        return new Attribute(
            get: fn () => round(($this->has_tax)?($this->total + $this->totalIva) * $this->taxes:0.00,2),
        );
    }

    protected function totalIva(): Attribute
    {
        return new Attribute(
            get: fn () => round(($this->has_iva)?$this->total * $this->iva:0.00,2),
        );
    }

    protected function totalWithTax(): Attribute
    {
        return new Attribute(
            get: fn () => ($this->total + $this->totalIva + $this->tax),
        );
    }

}
