<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\Currency;
use Illuminate\Support\Facades\Auth;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Select;
use Carbon\Carbon;

class Credit extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Credit>
     */
    public static $model = \App\Models\Credit::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public function title()
    {
        return $this->id.' - '.$this?->order?->id.' '.$this->order?->client?->first_name.' '.$this->order?->client?->last_name;
    }

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
            BelongsTo::make('Factura', 'order', 'App\Nova\Order'),
            Date::make('Fecha de Vencimiento','expire_at')->min(Carbon::tomorrow())
            ->max(Carbon::today()->addMonth(1)),
            Select::make('Estado','state')->options([
                'activo' => 'Activo',
                'pagado' => 'Pagado',
                'cancelado' => 'Cancelado',
            ])->displayUsingLabels(),
            Currency::make('Monto','amount')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD'),
            Currency::make('Deuda','debt')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD'),
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
        return 'Créditos';
    }

    public static function singularLabel() {
        return 'Crédito';
    }
}
