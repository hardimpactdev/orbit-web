<?php

namespace App\Providers;

use HardImpact\Orbit\OrbitServiceProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Register orbit-core routes
        OrbitServiceProvider::routes();
    }
}
