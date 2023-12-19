<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Http\Requests\NovaRequest;

class Country extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Country>
     */
    public static $model = \App\Models\Country::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'country';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id','country'
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
            Text::make('País','country')->required(),
            Text::make('Código de País','country_code')->required(),
            Select::make('Moneda','currency')->options([
                'USD' => 'Dólares Estadounidenses (USD)',
                'CAD' => 'Dólares Canadienses (CAD)',
                'MXN' => 'Pesos Mexicanos (MXN)',
                'BRL' => 'Reales Brasileños (BRL)',
                'ARS' => 'Pesos Argentinos (ARS)',
                'CLP' => 'Pesos Chilenos (CLP)',
                'COP' => 'Pesos Colombianos (COP)',
                'PEN' => 'Soles Peruanos (PEN)',
                'UYU' => 'Pesos Uruguayos (UYU)',
                'CUC' => 'Pesos Cubanos Convertibles (CUC)',
                'CRC' => 'Colones Costarricenses (CRC)',
                'GTQ' => 'Quetzales Guatemaltecos (GTQ)',
                'BZD' => 'Dólares de Belice (BZD)',
                'BOB' => 'Bolivianos (BOB)',
                'VEF' => 'Bolívares Venezolanos (VEF)',
                'PYG' => 'Guaraníes Paraguayos (PYG)',
                'HNL' => 'Lempiras Hondureñas (HNL)',
                'NIO' => 'Córdobas Nicaragüenses (NIO)',
                'HTG' => 'Gourdes Haitianos (HTG)',
                'DOP' => 'Pesos Dominicanos (DOP)',
                'BSD' => 'Dólares de las Bahamas (BSD)',
                'TTD' => 'Dólares de Trinidad y Tobago (TTD)',
                'JMD' => 'Dólares Jamaiquinos (JMD)',
                'KYD' => 'Dólares de las Islas Caimán (KYD)',
                'PAB' => 'Balboas Panameños (PAB)',
                'XCD' => 'Dólares del Caribe Oriental (XCD)',
                'AWG' => 'Florines Arubianos (AWG)',
                'ANG' => 'Florines de las Antillas Neerlandesas (ANG)',
                'BBD' => 'Dólares de Barbados (BBD)',
                'SRD' => 'Dólares de Surinam (SRD)',
                'BMD' => 'Dólares de Bermudas (BMD)',
                'SVC' => 'Colones Salvadoreños (SVC)',
                'GYD' => 'Dólares Guyaneses (GYD)',
                'NPR' => 'Rupias Nepalesas (NPR)',
                'GMD' => 'Dalasis Gambianos (GMD)',
                'FJD' => 'Dólares Fiyianos (FJD)',
                'TWD' => 'Dólares Nuevos Taiwaneses (TWD)',
                'SBD' => 'Dólares de las Islas Salomón (SBD)',
                'XPF' => 'Francos CFP (XPF)',
                'TOP' => 'Paʻangas de Tonga (TOP)',
                'VUV' => 'Vatus de Vanuatu (VUV)',
                // Add more currencies as needed
            ]),
            Text::make('Nombre de Documento 1','document_1')->required(),
            Text::make('Mascara del Documento 1 ej(00000000-0)','mask_1'),
            Text::make('Nombre de Documento 2','document_2'),
            Text::make('Mascara del Documento 2','mask_2'),
            Text::make('Nombre de Documento 3','document_3'),
            Text::make('Mascara del Documento 3','mask_3'),
            Text::make('Nombre del Impuesto','tax'),
            Number::make('Impuesto','tax_percentage')->min(0.00)->max(1)->step(0.01),
            Number::make('Impuesto de País','iva')->min(0.00)->max(1)->step(0.01),
            Textarea::make('Comentarios','comments')->maxlength(250)
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
        return 'Paises';
    }

    public static function singularLabel() {
        return 'País';
    }
}
