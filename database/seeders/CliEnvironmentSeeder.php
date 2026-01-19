<?php

namespace Database\Seeders;

use HardImpact\Orbit\Models\Environment;
use Illuminate\Database\Seeder;

class CliEnvironmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (config('orbit.mode') === 'cli') {
            if (Environment::where('is_local', true)->count() === 0) {
                Environment::create([
                    'name' => 'Local',
                    'host' => '127.0.0.1',
                    'user' => get_current_user(),
                    'port' => 22,
                    'is_local' => true,
                    'is_default' => true,
                    'tld' => 'test',
                    'status' => Environment::STATUS_ACTIVE,
                ]);
            }
        }
    }
}
