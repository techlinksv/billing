<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'credit_id',
        'bill_number',
        'amount',
        'comments',
    ];
   
    public function credit()
    {
        return $this->belongsTo(Credit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
