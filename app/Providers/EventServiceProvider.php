<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
use App\Observers\ProductObserver;
use App\Models\Product;
use App\Observers\ClientObserver;
use App\Models\Client;
use App\Observers\BatchObserver;
use App\Models\Batch;
use App\Observers\PaymentObserver;
use App\Models\Payment;
use App\Observers\MovementObserver;
use App\Models\Movement;
use App\Observers\OrderObserver;
use App\Models\Order;
use App\Observers\TransactionObserver;
use App\Models\Transaction;
use App\Observers\ItemObserver;
use App\Models\Item;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    protected $observers = [
        Product::class => [ProductObserver::class],
        Client::class => [ClientObserver::class],
        Batch::class => [BatchObserver::class],
        Payment::class => [PaymentObserver::class],
        Movement::class => [MovementObserver::class],
        Order::class => [OrderObserver::class],
        Transaction::class => [TransactionObserver::class],
        Item::class => [ItemObserver::class],

    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
