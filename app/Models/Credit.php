<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Credit extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'amount',
        'expire_at',
        'state',
        'comments'
    ];

    protected $casts = [
        'expire_at' => 'date',
        'amount' => 'decimal:2'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }


    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    protected function debt(): Attribute
    {
        return new Attribute(
            get: fn () => round($this->amount - ($this->payments()->sum('amount') ),2),
        );
    }

    protected function paid(): Attribute
    {
        return new Attribute(
            get: fn () => (  round($this->payments()->sum('amount'),2)),
        );
    }

    public function isExpired(): Attribute
    {
        return new Attribute(
            get: fn () => $this->expire_at->isPast(),
        );
    }
}