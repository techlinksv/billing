<?php

namespace App\Observers;

use App\Models\Movement;
use App\Models\Batch;

class MovementObserver
{
    /**
     * Handle the Movement "creating" event.
     */
    public function creating(Movement $movement): void
    {
        $batch = Batch::find($movement->batch_id);
        $movement->user_id = auth()?->user()?->id;
        if($movement->type == 'entrada'){
            $batch->quantity = $batch->quantity + $movement->quantity;
        }
        else if($movement->type == 'salida'){
            $batch->quantity = $batch->quantity - $movement->quantity;
        }
        $batch->saveQuietly();
    }

    /**
     * Handle the Movement "updated" event.
     */
    public function updated(Movement $movement): void
    {
        //
    }

    /**
     * Handle the Movement "deleted" event.
     */
    public function deleted(Movement $movement): void
    {
        //
    }

    /**
     * Handle the Movement "restored" event.
     */
    public function restored(Movement $movement): void
    {
        //
    }

    /**
     * Handle the Movement "force deleted" event.
     */
    public function forceDeleted(Movement $movement): void
    {
        //
    }
}
