<?php

namespace App\Observers;

use App\Models\Item;
use App\Models\Batch;
use App\Models\Credit;

use Illuminate\Support\Facades\Auth;

class ItemObserver
{
    /**
     * Handle the Item "created" event.
     */
    public function creating(Item $item): void
    {
       
        if($item->batch_id){
            $batch = Batch::find($item->batch_id);
            $batch->quantity =  $batch->quantity - $item->quantity;
            $batch->save();
            $item->cost = $batch->product?->price;
            
            if(Auth::guard('web')->check()  && ($credit = Credit::where('order_id',$batch->order_id)->first())){
                $credit->amount = $credit->amount + ($item->price * $item->quantity);
                $credit->save();
            }
        }
       
    }

    /**
     * Handle the Item "updated" event.
     */
    public function updated(Item $item): void
    {
        //
    }

    /**
     * Handle the Item "deleted" event.
     */
    public function deleted(Item $item): void
    {
        //
    }

    /**
     * Handle the Item "restored" event.
     */
    public function restored(Item $item): void
    {
        //
    }

    /**
     * Handle the Item "force deleted" event.
     */
    public function forceDeleted(Item $item): void
    {
        //
    }
}
