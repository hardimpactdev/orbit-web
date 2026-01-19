<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Orbit Mode
    |--------------------------------------------------------------------------
    |
    | Determines whether Orbit is running in web (single environment) or
    | desktop (multi-environment) mode.
    |
    */
    'mode' => env('ORBIT_MODE', 'web'),

    /*
    |--------------------------------------------------------------------------
    | Multi-Environment Management
    |--------------------------------------------------------------------------
    |
    | When true, enables multi-environment management UI and routing.
    | When false, uses implicit environment injection via middleware.
    |
    */
    'multi_environment_management' => env('ORBIT_MODE') !== 'cli' && env('MULTI_ENVIRONMENT_MANAGEMENT', true),
];
