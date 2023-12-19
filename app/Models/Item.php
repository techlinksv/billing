<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes;

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    protected function total(): Attribute
    {
        return new Attribute(
            get: fn () => round($this->price * $this->quantity,2),
        );
    }

    protected function total_cost(): Attribute
    {
        return new Attribute(
            get: fn () => round($this->cost * $this->quantity ,2),
        );
    }

    protected function tax(): Attribute
    {
        return new Attribute(
            get: fn () => round(($this->order?->has_tax)?($this->total + $this->totalIva) * $this->order?->taxes:0.00,2),
        );
    }

    protected function totalIva(): Attribute
    {
        return new Attribute(
            get: fn () => round(($this->order?->has_iva)?$this->total * $this->order?->iva:0.00,2),
        );
    }
}
