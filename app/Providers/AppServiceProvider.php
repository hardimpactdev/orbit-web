<?php

namespace App\Providers;

use HardImpact\Orbit\OrbitServiceProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register orbit-core routes
        OrbitServiceProvider::routes();
    }
}
