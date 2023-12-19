<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\MovementController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AuthController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/




Route::middleware('auth:api')->group(function () {
    Route::apiResources([
        'products' => ProductController::class,
        'warehouses' => WarehouseController::class,
        'clients' => ClientController::class,
        'transactions' => TransactionController::class,
        'orders' => OrderController::class,
        'credits' => CreditController::class,
        'payments' => PaymentController::class,
        'movements' => MovementController::class,
        'categories' => CategoryController::class,

    ]);
    Route::get('me',[AuthController::class,'me']);
    Route::get('users/{id}',[AuthController::class,'user']);
    Route::get('payments-list', [PaymentController::class, 'list']);
    Route::post('payments-store', [PaymentController::class, 'pay']);
    Route::get('clients-list', [ClientController::class, 'list']);
    Route::get('credits-list', [CreditController::class, 'list']);
    Route::get('products-list', [ProductController::class, 'list']);
    Route::get('clients-count', [ClientController::class, 'count']);
    Route::get('clients-debt', [ClientController::class, 'clientsDebts']);

    Route::post('products-import', [ProductController::class, 'import']);
    Route::post('movements-list', [MovementController::class, 'multipleStore']);




    Route::get('users', [ReportController::class, 'users']);
    Route::prefix('report')->group(function () {
        Route::get('/batches', [ReportController::class,'batches']);
        Route::get('/batches-total', [ReportController::class,'batchesTotal']);
        Route::get('/batches-export', [ProductController::class, 'export']);

        Route::get('/earnings', [ReportController::class,'benefits']);
        Route::get('/earnings-export', [ReportController::class,'benefitsReport']);
        Route::get('/earnings-total', [ReportController::class,'benefitsTotal']);
        
        Route::get('/debts', [ReportController::class,'debts']);
        Route::get('/debts-total', [ReportController::class,'debtsTotal']);
        Route::get('/debts-export', [ReportController::class,'debtsReport']);
        Route::get('/clients-debt-export', [ClientController::class, 'clientsDebtsExport']);


        Route::get('/sales', [ReportController::class,'sales']);
        Route::get('/sales-report', [ReportController::class,'salesReport']);
        Route::get('/sales-total', [ReportController::class,'salesTotal']);
        
        
        Route::get('/products', [ReportController::class,'products']);
        Route::get('/products-export', [ReportController::class, 'productsReport']); 

        Route::get('/client-export', [ReportController::class,'clientReport']); //TODO
        Route::get('/movements-report', [ReportController::class,'benefitsReport']);
        Route::get('/order-export', [OrderController::class,'export']);
        
        Route::get('/sales-by-user-export', [ReportController::class,'userReport']); //TODO
        Route::get('/movements-export', [MovementController::class,'export']); //TODO

        Route::get('income-export', [TransactionController::class, 'export']);
        Route::get('expenses-export', [TransactionController::class, 'export']);

    });
});

Route::apiResources([
    'countries' => CountryController::class,
]);

Route::controller(AuthController::class)->group(function () { //all auth routes on AuthController for api
    Route::post('/login', 'apiLogin'); //login with email and pasword
});