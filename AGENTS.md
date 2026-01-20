# Agent Instructions

## Project Overview

**orbit-web** is a minimal Laravel shell that provides a web dashboard for managing Orbit CLI installations. Most business logic comes from the [orbit-core](https://github.com/hardimpactdev/orbit-core) package, with some local infrastructure (CSP, middleware, home page).

## Repository Locations

| Project | Location | Purpose |
|---------|----------|---------|
| orbit-core | `~/projects/orbit-core` (remote) | Shared Laravel package |
| orbit-web | `~/projects/orbit-web` (remote) | Web dashboard shell |
| orbit-desktop | Local Mac | NativePHP desktop shell |
| orbit-cli | `~/projects/orbit-cli` (remote) | CLI tool |

## Project Structure

```
orbit-web/
  app/
    Models/User.php                    # Only local model
    Providers/
      AppServiceProvider.php           # Registers orbit-core routes
      HorizonServiceProvider.php       # Horizon configuration
      ToolbarConfigProvider.php        # Dev toolbar config
    Http/
      Controllers/
        HomeController.php             # Local home page
      Middleware/
        HandleInertiaRequests.php      # Local Inertia middleware
        GenerateAndSetCspNonce.php     # CSP nonce generation
    Support/
      Csp/                             # Content Security Policy
  config/
    orbit.php                          # Mode configuration
    csp.php                            # CSP settings
    horizon.php                        # Horizon config
    reverb.php                         # WebSocket config
  resources/
    views/app.blade.php                # Blade template
    js/
      pages/Home.vue                   # Local home page component
      components/AppLogoIcon.vue       # Local logo component
  vite.config.ts                       # Compiles assets from orbit-core
  composer.json                        # Requires hardimpactdev/orbit-core
```

## Key Configuration

### Web Mode Settings

```env
ORBIT_MODE=web
# MULTI_ENVIRONMENT_MANAGEMENT defaults to true when ORBIT_MODE is not 'cli'
# Set to false explicitly if single-environment mode is desired
MULTI_ENVIRONMENT_MANAGEMENT=true
```

### Route Registration

Routes are registered in `AppServiceProvider`:

```php
use HardImpact\Orbit\OrbitServiceProvider;

public function boot(): void
{
    OrbitServiceProvider::routes();
}
```

### Vite Configuration

Assets are compiled from orbit-core using laravel-vite-plugin:

```typescript
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'vendor/hardimpactdev/orbit-core/resources/js/app.ts',
                'vendor/hardimpactdev/orbit-core/resources/css/app.css',
            ],
            // ...
        }),
    ],
});
```

## Development Commands

```bash
# Install dependencies
composer install
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Run tests
php artisan test

# Update orbit-core
composer update hardimpactdev/orbit-core
```

## Important Notes

- This is a **minimal shell** - avoid adding business logic here when possible
- Most controllers, services, models (except User) come from orbit-core
- Local exceptions: HomeController, CSP middleware, Horizon/Toolbar providers
- If you need to change core functionality, update orbit-core instead
- Always update orbit-core after making changes: `composer update hardimpactdev/orbit-core`

## Local Development Instances

**CRITICAL**: There are TWO web instances. Always develop on `orbit-web.ccc`.

| URL | Serves From | Purpose |
|-----|-------------|---------|
| `orbit-web.ccc` | This workspace (`~/projects/orbit-web/`) | **Development** - Edit code here |
| `orbit.ccc` | `~/.config/orbit/web/` | Bundled CLI instance (read-only) |

### Development Workflow

```bash
# 1. Make changes in this workspace
cd ~/projects/orbit-web  # or via symlink: ~/workspaces/orbit/orbit-web

# 2. Update orbit-core if backend changes were made
composer update hardimpactdev/orbit-core

# 3. Rebuild frontend if needed
bun run build

# 4. Test on orbit-web.ccc
# Ensure Horizon is running for async job processing

# 5. Commit and push
git add . && git commit -m "..." && git push

# 6. Update bundled instance (for final verification only)
cd ~/.config/orbit/web
composer update hardimpactdev/orbit-core --no-cache
```

### Horizon Queue Workers

For async site creation to work, Horizon must be running:

```bash
# Development instance (orbit-web.ccc)
cd ~/projects/orbit-web && nohup php artisan horizon > /tmp/horizon-orbit-web.log 2>&1 &

# Bundled instance (orbit.ccc) - usually already running
cd ~/.config/orbit/web && nohup php artisan horizon > /tmp/horizon.log 2>&1 &
```

### Never Work Directly on orbit.ccc

The bundled instance (`~/.config/orbit/web/`) should only be updated via `composer update`. All code changes must go through this workspace, be pushed to GitHub, and then pulled into consumers.

## Web Mode Behavior

In web mode (`MULTI_ENVIRONMENT_MANAGEMENT=false`):
- Routes are flat: `/projects`, `/services`, etc.
- `ImplicitEnvironment` middleware injects the local environment
- Environment switcher UI is hidden
- SSH key management returns 403

## Testing

```bash
# Run all tests
php artisan test

# Run architecture tests
php artisan test tests/Feature/ArchitectureTest.php
```

## After orbit-core Updates

When orbit-core is updated:

```bash
composer update hardimpactdev/orbit-core
bun run build
php artisan migrate  # If new migrations
```
