<?php

namespace App\Observers;

use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

class PaymentObserver
{

    public function creating(Payment $payment): void 
    {
        if( Auth::user()){
            $user = Auth::user();
            $payment->user_id = $user?->id;
            if(!$payment->bill_number){
                $payment->bill_number = $user->payments_counter;
                $user->payments_counter = $user->payments_counter + 1;
                $user->save();
            }
        }
    }
    /**
     * Handle the Payment "created" event.
     */
    public function created(Payment $payment): void
    {
       $credit = $payment->credit;
       if ($credit->debt <= 0){
            $credit->state = 'pagado';
            $credit->save();
       }
    }

    /**
     * Handle the Payment "updated" event.
     */
    public function updated(Payment $payment): void
    {
        //
    }

    /**
     * Handle the Payment "deleted" event.
     */
    public function deleted(Payment $payment): void
    {
       $credit = $payment->credit;
       if (($payment->amount > 0 ) && ($credit->state == 'pagado')){
            $credit->state = 'activo';
            $credit->save();
       }
    }

    /**
     * Handle the Payment "restored" event.
     */
    public function restored(Payment $payment): void
    {
        //
    }

    /**
     * Handle the Payment "force deleted" event.
     */
    public function forceDeleted(Payment $payment): void
    {
        //
    }
}
