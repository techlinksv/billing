<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Textarea;
use Illuminate\Support\Facades\Auth;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\HasMany;
use Maatwebsite\LaravelNovaExcel\Actions\DownloadExcel;
use App\Nova\Actions\ImportClient;

class Client extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Client>
     */
    public static $model = \App\Models\Client::class;

    /**
     * Get the displayable name of the filter.
     *
     * @return string
     */
    public function title()
    {
        return $this->id.' - '.$this->first_name.' '.$this->last_name;
    }
    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id','first_name','last_name','document_1','document_2','email','company'
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
            Text::make('Nombres','first_name')->required(),
            Text::make('Apellidos','last_name')->required(),
            Text::make('Empresa','company')->required(),
            Text::make('Teléfono','phone')->required(),
            Text::make('Teléfono Secundario','phone_2')->required(false),
            Text::make('Dirección','address'),
            Text::make('Email','email')->required(),
            ($hasCountryId == null)?BelongsTo::make('País', 'country', 'App\Nova\Country'):null,
            Text::make((Auth::user()?->country)?Auth::user()?->country?->document_1:'Documento 1'
            ,'document_1')->required(),
            (Auth::user()?->country?->document_2)?Text::make(Auth::user()?->country?->document_2,'document_2')->required(false):null,
            (Auth::user()?->country?->document_3)?Text::make(Auth::user()?->country?->document_3,'document_3')->required(false):null,
            Currency::make('Limite de Crédito','credit_limit')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD'),
            Currency::make('Deuda','debt')->currency((Auth::user()?->country)?Auth::user()?->country?->currency:'USD')->exceptOnForms(),
            Textarea::make('Comentarios','comments')->required('false')->maxlength(250),
            HasMany::make('Créditos', 'credits', 'App\Nova\Credit'),
            HasMany::make('Facturas', 'orders', 'App\Nova\Order'),


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
            (new ImportClient)->standalone(),

        ];
    }

    public static function label() {
        return 'Clientes';
    }

    public static function singularLabel() {
        return 'Cliente';
    }
}
