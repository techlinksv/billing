<?php

namespace App\Observers;

use App\Models\Batch;
use App\Models\Movement;


class BatchObserver
{
     /**
     * Handle the Batch "saved" event.
     */
    public function saved(Batch $batch): void
    {
        if($batch->isDirty('quantity')){
            $old = $batch->getOriginal('quantity');
            $movement = new Movement();
            $movement->user_id = auth()?->user()?->id;
            $movement->batch_id = $batch->id;
            $movement->type = ($old > $batch->quantity)?'salida':'entrada';
            $movement->quantity = abs($old - $batch->quantity);
            $movement->saveQuietly();
        }
    }

    /**
     * Handle the Batch "created" event.
     */
    public function created(Batch $batch): void
    {
        //
    }

    /**
     * Handle the Batch "updated" event.
     */
    public function updated(Batch $batch): void
    {
        //
    }

    /**
     * Handle the Batch "deleted" event.
     */
    public function deleted(Batch $batch): void
    {
        //
    }

    /**
     * Handle the Batch "restored" event.
     */
    public function restored(Batch $batch): void
    {
        //
    }

    /**
     * Handle the Batch "force deleted" event.
     */
    public function forceDeleted(Batch $batch): void
    {
        //
    }
}
