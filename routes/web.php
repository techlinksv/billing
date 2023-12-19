<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () { return view('welcome'); });
Route::get('/inicio', function () { return view('welcome'); });
Route::get('/agregar-cliente', function () { return view('welcome'); });
Route::get('/clientes', function () { return view('welcome'); });
Route::get('/cliente/{id}', function () { return view('welcome'); });
Route::get('/cargar-productos', function () { return view('welcome'); });
Route::get('/agregar-productos', function () { return view('welcome'); });
Route::get('/listado-de-productos', function () { return view('welcome'); });
Route::get('/producto/{id}', function () { return view('welcome'); });
Route::get('/gestionar-creditos', function () { return view('welcome'); });
Route::get('/editar-credito/{id}', function () { return view('welcome'); });
Route::get('/estado-de-credito/{id}', function () { return view('welcome'); });
Route::get('/registrar-compra', function () { return view('welcome'); });
Route::get('/anular-factura/{id}', function () { return view('welcome'); });
Route::get('/anular-factura', function () { return view('welcome'); });
Route::get('/agregar-abono', function () { return view('welcome'); });
Route::get('/anular-abono', function () { return view('welcome'); });
Route::get('/anular-abono/{id}', function () { return view('welcome'); });
Route::get('/agregar-producto/{id}', function () { return view('welcome'); });
Route::get('/ingresos', function () { return view('welcome'); });
Route::get('/ver-ingresos', function () { return view('welcome'); });
Route::get('/gastos', function () { return view('welcome'); });
Route::get('/ver-gastos', function () { return view('welcome'); });
Route::get('/reportes', function () { return view('welcome'); });
Route::get('/reporte/{id}', function () { return view('welcome'); });
Route::get('/reporte/por-factura/{id}', function () { return view('welcome'); });
Route::get('/reporte/cuentas-por-cobrar/{id}', function () { return view('welcome'); });

Route::controller(AuthController::class)->group(function () { //all auth routes on AuthController for web session
    Route::post('/login', 'login')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]); //login with email and pasword, return to root / on success with user session, on error goes back with email error
});