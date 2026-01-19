# Agent Instructions

## Project Overview

**orbit-web** is a thin Laravel shell that provides a web dashboard for managing Orbit CLI installations. All business logic comes from the [orbit-core](https://github.com/hardimpactdev/orbit-core) package.

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
    Models/User.php                  # Only local model
    Providers/AppServiceProvider.php # Registers orbit-core routes
  config/
    orbit.php                        # Mode configuration
  resources/
    views/app.blade.php              # Blade template
  vite.config.ts                     # Compiles assets from orbit-core
  composer.json                      # Requires hardimpactdev/orbit-core
```

## Key Configuration

### Web Mode Settings

```env
ORBIT_MODE=web
MULTI_ENVIRONMENT_MANAGEMENT=false
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

Assets are compiled from orbit-core:

```typescript
build: {
    rollupOptions: {
        input: "vendor/hardimpactdev/orbit-core/resources/js/app.ts",
    },
}
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

- This is a **thin shell** - do NOT add business logic here
- All controllers, services, models (except User) come from orbit-core
- If you need to change functionality, update orbit-core instead
- Always update orbit-core after making changes: `composer update hardimpactdev/orbit-core`

## Local Deployment: orbit.ccc

**CRITICAL**: `orbit.ccc` is served from `~/.config/orbit/web/`, NOT from this workspace.

| Location | Purpose |
|----------|---------|
| This workspace | Development (editing code) |
| `~/.config/orbit/web/` | **Live deployment** (what orbit.ccc serves) |

When fixing frontend issues on `orbit.ccc`:

```bash
# Update and rebuild in the DEPLOYED location, not the workspace
cd ~/.config/orbit/web
composer update hardimpactdev/orbit-core
bun run build
```

Building in this workspace will NOT affect `orbit.ccc`.

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
