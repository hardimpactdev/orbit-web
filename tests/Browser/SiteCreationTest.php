<?php

/**
 * Site Creation Flow Browser Tests
 *
 * NOTE: Full e2e tests against orbit-web.ccc with real data should use Playwright.
 * See: tests/e2e/site-creation.spec.ts
 *
 * These Pest browser tests are placeholders for when proper database seeding is set up.
 * The tests are skipped by default since they require:
 * - Proper Environment model seeding
 * - GitHub token configuration
 * - Horizon running
 *
 * @see /docs/flows/site-creation.md
 */

describe('Site Creation Flow', function () {
    it('has e2e tests available in Playwright', function () {
        // Full e2e browser tests for site creation are in tests/e2e/site-creation.spec.ts
        // Run with: npx playwright test tests/e2e/site-creation.spec.ts
        //
        // Prerequisites:
        // - orbit-web.ccc must be accessible
        // - Horizon must be running: php artisan horizon
        // - Template: hardimpactdev/craft-starterkit

        expect(file_exists(base_path('tests/e2e/site-creation.spec.ts')))->toBeTrue();
    });
})->skip(
    message: 'E2E browser tests use Playwright - run: npx playwright test tests/e2e/site-creation.spec.ts'
);
