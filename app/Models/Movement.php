<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movement extends Model
{
    use HasFactory;

    protected $casts = [
        'quantity' => 'decimal:2'
    ];

    protected $fillable = [
        'batch_id',
        'type',
        'quantity',
        'comments',
        'canceled',
        'movement_number'
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
