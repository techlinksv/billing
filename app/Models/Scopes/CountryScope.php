<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class CountryScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        // Check if the authenticated user has a country_id
        if (auth()->check() && auth()->user()->country_id) {
            // Apply the country_id filter to the builder
            $builder->where('country_id', auth()->user()->country_id);
        }

        if (auth('api')->check() && auth('api')->user()->country_id) {
            // Apply the country_id filter to the builder
            $builder->where('country_id', auth('api')->user()->country_id);
        }
    }
}
