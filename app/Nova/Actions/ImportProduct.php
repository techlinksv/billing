<?php

namespace App\Nova\Actions;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ExcelProductImport;
use Laravel\Nova\Fields\File;


class ImportProduct extends Action
{
    use InteractsWithQueue, Queueable;

    /**
     * Perform the action on the given models.
     *
     * @param  \Laravel\Nova\Fields\ActionFields  $fields
     * @param  \Illuminate\Support\Collection  $models
     * @return mixed
     */
    public function handle(ActionFields $fields, Collection $models)
    {
        try{
            Excel::import(new ExcelProductImport(), request()->file('file'));
            return Action::message('Archivo importado exitosamente');
        }catch (\Exception $exception){
            \Log::error($exception);
            return Action::danger('Error al importar archivo');
        }
    }

    /**
     * Get the fields available on the action.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            File::make('Archivo Excel','file')
                ->rules('required', 'file', 'mimes:xlsx,txt,csv,xls')
                ->store(function (Request $request, $model) {

                }),
        ];
    }
}
