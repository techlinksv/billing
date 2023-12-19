<?php

namespace App\Observers;

use App\Models\Client;

class ClientObserver
{
     /**
     * Handle the Client "creating" event.
     */
    public function creating(Client $client): void
    {
        if (auth()->check() && auth()->user()->country_id) {
           $client->country_id = auth()->user()->country_id;
        }
        
    }

    /**
     * Handle the Client "updated" event.
     */
    public function updated(Client $client): void
    {
        //
    }

    /**
     * Handle the Client "deleted" event.
     */
    public function deleted(Client $client): void
    {
        //
    }

    /**
     * Handle the Client "restored" event.
     */
    public function restored(Client $client): void
    {
        //
    }

    /**
     * Handle the Client "force deleted" event.
     */
    public function forceDeleted(Client $client): void
    {
        //
    }
}
