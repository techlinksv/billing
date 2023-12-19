<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\Currency;
use Illuminate\Support\Facades\Auth;


class Transaction extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Transaction>
     */
    public static $model = \App\Models\Transaction::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'id';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function fields(NovaRequest $request)
    {

        return [
            ID::make()->sortable(),
            BelongsTo::make('País', 'country', 'App\Nova\Country'),
            Select::make('Tipo','type')->options([
                'ingreso' => 'Ingreso',
                'egreso' => 'Egreso',
            ]),
            Select::make('Método','method')->options([
                'efectivo' => 'Eféctivo',
                'cheque' => 'Cheque',
            ]),
            Text::make('Número de cheque','check_number'),
            Text::make('Banco','bank'),
            Date::make('Fecha','date'),
            Text::make('Razón','reason'),
            BelongsTo::make('Categoria', 'category', 'App\Nova\Category'),
            Currency::make('Monto','amount')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD')->exceptOnForms(),
        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function cards(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function filters(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function lenses(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function actions(NovaRequest $request)
    {
        return [];
    }

    public static function label() {
        return 'Transacciones';
    }

    public static function singularLabel() {
        return 'Transacción';
    }
}
