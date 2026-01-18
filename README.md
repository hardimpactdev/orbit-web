# Orbit Web

A web dashboard for managing local development environments powered by [Orbit CLI](https://github.com/nckrtl/orbit-cli). This is a thin shell that requires [orbit-core](https://github.com/hardimpactdev/orbit-core).

## Overview

Orbit Web provides a browser-based interface to manage your Orbit CLI installation on a single server. For multi-environment management across local and remote servers, see [orbit-desktop](https://github.com/hardimpactdev/orbit).

### Features

- **Project Management**: Create, configure, and monitor Laravel projects
- **Service Control**: Start/stop PHP-FPM, Caddy, Redis, PostgreSQL, etc.
- **Real-time Status**: WebSocket-based updates via Laravel Reverb
- **Health Checks**: Doctor command for diagnosing environment issues
- **Template Favorites**: Save frequently used project templates

## Requirements

- PHP 8.3+
- Node.js 18+ (or Bun)
- Composer
- Orbit CLI installed on the server

## Installation

```bash
# Clone the repository
git clone https://github.com/hardimpactdev/orbit-web.git
cd orbit-web

# Install dependencies
composer install
bun install

# Configure environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Initialize local environment
php artisan orbit:init

# Build frontend assets
bun run build

# Start the application
php artisan serve
```

## Configuration

### Environment Variables

```env
# Required
APP_URL=https://orbit.test

# Orbit configuration (web mode is default)
ORBIT_MODE=web
MULTI_ENVIRONMENT_MANAGEMENT=false
```

### orbit:init Command

Creates the local environment record:

```bash
php artisan orbit:init
```

- Idempotent (safe to run multiple times)
- Reads TLD from `~/.config/orbit/config.json`
- Falls back to `.test` if not configured

## Architecture

This project is a **thin shell** that delegates to [orbit-core](https://github.com/hardimpactdev/orbit-core):

```
orbit-web/
  app/
    Models/User.php              # Only local model (auth)
    Providers/AppServiceProvider.php  # Registers orbit-core routes
  config/
    orbit.php                    # Mode configuration
  resources/
    views/app.blade.php          # Blade template
  vite.config.ts                 # Compiles from orbit-core
```

All business logic, controllers, services, and Vue components come from orbit-core.

## Development

```bash
# Start dev server
bun run dev

# Run tests
php artisan test

# Build for production
bun run build
```

## Related Projects

- [Orbit Core](https://github.com/hardimpactdev/orbit-core) - Shared package (required)
- [Orbit Desktop](https://github.com/hardimpactdev/orbit) - NativePHP desktop app
- [Orbit CLI](https://github.com/nckrtl/orbit-cli) - The CLI tool that powers everything

## License

MIT
