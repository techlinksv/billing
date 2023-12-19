<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\Client;
use App\Models\Credit;
use App\Models\Warehouse;
use Illuminate\Support\Facades\Auth;

class OrderObserver
{
    /**
     * Handle the Order "creating" event.
     */
    public function creating(Order $order): void
    {
        if($user = Auth::user()){
            $order->bill_number = $user->bills_counter;
            $user->bills_counter = $user->bills_counter + 1;
            $user->save();
        }

        $client = Client::find($order->client_id);
        if($client){
            $order->client_first_name = $client->first_name;
            $order->client_last_name = $client->last_name;
            $order->client_company = $client->company;
            $order->client_document_1 = $client->document_1;
            $order->client_document_2 = $client->document_2;
        }

        if($order->expire_at){
            unset($order->expire_at);
        }

        if(Auth::user() ){
            $order->user_id = Auth::user()->id;

        }

        if(Auth::user() && Auth::user()->country){
            $order->taxes = Auth::user()->country?->tax_percentage;
            $order->iva = Auth::user()->country?->iva;
            if(request()->tax && request()->has_tax){
                $order->taxes = request()->tax/100;
            }
        }
    }

    public function created(Order $order): void
    {
        if(Auth::guard('web')->check()  && $order->payment_type == 'credito'){
            $credit = new Credit();
            $credit->amount = $order->total + $order->tax + $order->totalIva;
            $credit->expire_at = request()->expire_at;
            $credit->state = 'activo';
            $credit->comments = 'Credito de compra para orden '.$order->id;
            $credit->order_id = $order->id;
            $credit->save();
        }
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        if($order->isDirty('state')){ //change on state
            switch($order->state){
                case 'anulado':
                    foreach($order->items as $item){
                        $batch = $item->batch;
                        $batch->quantity = $batch->quantity +  $item->quantity;
                        $batch->save();
                    }
                    break;
            }
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void
    {
        //
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void
    {
        //
    }
}
