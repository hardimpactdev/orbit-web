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

        if (config('orbit.mode') === 'cli') {
            $dbPath = config('database.connections.sqlite.database');
            
            if ($dbPath && ! str_contains($dbPath, ':memory:')) {
                $dbDir = dirname($dbPath);

                if (! is_dir($dbDir)) {
                    @mkdir($dbDir, 0755, true);
                }

                if (! file_exists($dbPath)) {
                    @touch($dbPath);
                }
            }
        }
    }
}
