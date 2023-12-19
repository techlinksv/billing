<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\HasMany;
use Illuminate\Support\Facades\Auth;
use App\Nova\Actions\ImportProduct;
use Maatwebsite\LaravelNovaExcel\Actions\DownloadExcel;

class Product extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Product>
     */
    public static $model = \App\Models\Product::class;

    /**
     * Get the value that should be displayed to represent the resource.
     *
     * @return string
     */
    public function title()
    {
        return $this->id.' - '.$this->sku.' - '.$this->name;
    }
    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id','sku','name'
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        $hasCountryId = auth()?->user()?->country_id;

        return array_filter([
            ID::make()->sortable(),
            Text::make('SKU','sku')->creationRules('unique:products,sku'),
            Text::make('Nombre','name'),
            Text::make('Unidades','units'),
            Text::make('Tamaño','size'),
            Currency::make('Costo','price')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD'),
            ($hasCountryId == null)?BelongsTo::make('País', 'country', 'App\Nova\Country'):null,
            HasMany::make('Inventarios', 'batches', 'App\Nova\Batch'),

                ],function ($value) {
                    return $value !== null;
            });
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
            (new ImportProduct)->standalone(),

        ];
    }

    public static function label() {
        return 'Productos';
    }

    public static function singularLabel() {
        return 'Producto';
    }

    
}
