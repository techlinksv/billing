<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\HasMany;
use Maatwebsite\LaravelNovaExcel\Actions\DownloadExcel;


use Laravel\Nova\Http\Requests\NovaRequest;

class Warehouse extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Warehouse>
     */
    public static $model = \App\Models\Warehouse::class;

    /**
     * Get the value that should be displayed to represent the resource.
     *
     * @return string
     */
    public function title()
    {
        return $this->id.' - '.$this->name;
    }

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id','name'
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
            Text::make('Nombre','name'),
            BelongsTo::make('País', 'country', 'App\Nova\Country'),
            HasMany::make('Inventarios', 'batches', 'App\Nova\Batch'),
          //  Number::make('# Factura inicial','bills_from'),
          //  Number::make('# Factura actual','bills_counter'),
          //  Number::make('# Factura final','bills_to'),
            Number::make('# Movimiento inicial','movements_from'),
            Number::make('# Movimiento actual','movements_counter'),
            Number::make('# Movimiento final','movements_to'),
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
        return [
            (new DownloadExcel)->withHeadings(),
        ];
    }

    public static function label() {
        return 'Bodegas';
    }

    public static function singularLabel() {
        return 'Bodega';
    }
}
