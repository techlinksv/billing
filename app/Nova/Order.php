<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Http\Requests\NovaRequest;
use Illuminate\Support\Facades\Auth;

class Order extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Order>
     */
    public static $model = \App\Models\Order::class;

    public function title()
    {
        return $this->id.' - #'.$this->bill_number;
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
        $hasCountryId = auth()?->user()?->country_id;

        return array_filter([
            ID::make()->sortable(),
            Text::make('N˚ Factura','bill_number')->required(false),
            BelongsTo::make('Cliente','client','App\Nova\Client')->nullable()->hideFromIndex(),
            BelongsTo::make('Usuario','user','App\Nova\User')->nullable()->exceptOnForms(),
            Text::make('Nombres','client_first_name')->creationRules('required_if:client_id,null'),
            Text::make('Apellidos','client_last_name'),
            Text::make('Empresa','client_company')->creationRules('required_if:client_id,null'),
            Select::make('Tipo de pago','payment_type')->options([
                'efectivo' => 'Efectivo',
                'credito' => 'Crédito',
            ])
            ->default('efectivo')
            ->displayUsingLabels(),
            Date::make('Fecha de Vencimiento de Crédito','expire_at'),
            ($hasCountryId == null)?BelongsTo::make('País', 'country', 'App\Nova\Country'):null,
            Text::make((Auth::user()?->country)?Auth::user()?->country?->document_1:'Documento 1'
            ,'client_document_1')->creationRules('required_if:client_id,null'),
            (Auth::user()?->country?->document_2)?Text::make(Auth::user()?->country?->document_2,'client_document_2')->required(false):null,
            Currency::make('Costo','cost')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD')->exceptOnForms(),
            Currency::make('IVA',
            'totalIva')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD')->exceptOnForms(),
            Currency::make((Auth::user()?->country)?Auth::user()?->country?->tax:'Tax',
            'tax')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD')->exceptOnForms(),
            Currency::make('Total','total')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD')->exceptOnForms(),
            Textarea::make('Comentarios','comments')->required('false')->maxlength(250)->hideFromIndex(),
            HasMany::make('Items', 'items', 'App\Nova\Item'),
        
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
        return [];
    }

    public static function label() {
        return 'Facturas';
    }

    public static function singularLabel() {
        return 'Factura';
    }
}
