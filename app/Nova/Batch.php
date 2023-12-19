<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Number;

class Batch extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Batch>
     */
    public static $model = \App\Models\Batch::class;


    public function title()
    {
        return $this->warehouse?->name.' - '.$this->product?->sku.' - '.$this->product?->name;
    }

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
            BelongsTo::make('Bodega', 'warehouse', 'App\Nova\Warehouse'),
            BelongsTo::make('Producto', 'product', 'App\Nova\Product'),
            Number::make('Cantidad','quantity')->min(0.01)->step(0.01),

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
        return 'Inventarios';
    }

    public static function singularLabel() {
        return 'Inventario';
    }
}
