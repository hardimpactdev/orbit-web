import { test, expect } from '@playwright/test';

/**
 * Site Creation Flow E2E Tests
 *
 * These tests run against the actual orbit-web.ccc server with real GitHub integration.
 * For unit/feature browser tests, use Pest browser tests in tests/Browser/.
 *
 * Prerequisites:
 * - orbit-web.ccc must be running
 * - Horizon must be running: cd ~/projects/orbit-web && php artisan horizon
 * - Use hardimpactdev/craft-starterkit as the template
 *
 * @see /docs/flows/site-creation.md
 */

test.describe('Site Creation Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/environments/1/sites/create');
        await page.waitForLoadState('networkidle');
        // Wait for GitHub orgs to load
        await page.waitForTimeout(2000);
    });

    test('loads form with all required elements', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'New Site' })).toBeVisible();
        await expect(page.locator('#name')).toBeVisible();
        await expect(page.locator('#template')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Organization' })).toBeVisible();
    });

    test('shows organization dropdown with GitHub accounts', async ({ page }) => {
        // Should show organization section
        await expect(page.getByRole('heading', { name: 'Organization' })).toBeVisible();
        // Should have personal account option in combobox
        await expect(page.getByRole('combobox')).toBeVisible();
        await expect(page.getByRole('combobox')).toContainText('Personal');
    });

    test('submit button is disabled initially', async ({ page }) => {
        const submitButton = page.locator('button:has-text("Create Site")');
        await expect(submitButton).toBeDisabled();
    });

    test('enables submit button when name is provided', async ({ page }) => {
        const testName = `e2e-test-${Date.now()}`;
        const submitButton = page.locator('button:has-text("Create Site")');

        // Fill name
        await page.fill('#name', testName);

        // Wait for repo check (debounced)
        await page.waitForTimeout(3500);

        await expect(submitButton).toBeEnabled();
    });

    test('shows repo availability status', async ({ page }) => {
        const testName = `e2e-test-${Date.now()}`;

        await page.fill('#name', testName);
        await page.waitForTimeout(3500);

        // Should show "is available" message
        await expect(page.locator('text=is available')).toBeVisible();
    });

    test('shows slug preview for names with spaces', async ({ page }) => {
        await page.fill('#name', 'My Test Site');
        await page.waitForTimeout(500);

        await expect(page.getByText('my-test-site', { exact: true })).toBeVisible();
    });
});

test.describe('Template Detection', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/environments/1/sites/create');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
    });

    test('detects GitHub template repository', async ({ page }) => {
        await page.fill('#template', 'hardimpactdev/craft-starterkit');
        await page.waitForTimeout(3500);

        // Should show Template badge
        await expect(page.locator('.bg-lime-500\\/10:has-text("Template")')).toBeVisible();
        // Should show Laravel framework badge
        await expect(page.locator('span.bg-zinc-700:has-text("laravel")')).toBeVisible();
    });

    test('shows PHP version recommendation', async ({ page }) => {
        await page.fill('#template', 'hardimpactdev/craft-starterkit');
        await page.waitForTimeout(3500);

        // Should show PHP version badge (purple badge)
        await expect(page.locator('.bg-purple-500\\/10:has-text("PHP")')).toBeVisible();
    });

    test('shows configuration options for template', async ({ page }) => {
        await page.fill('#template', 'hardimpactdev/craft-starterkit');
        await page.waitForTimeout(3500);

        // Should show Configuration Options section
        await expect(page.locator('text=Configuration Options')).toBeVisible();
    });
});

test.describe('Site Creation Submission', () => {
    test('submits form and redirects to sites list', async ({ page }) => {
        const testName = `e2e-submit-${Date.now()}`;

        await page.goto('/environments/1/sites/create');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Fill form with template
        await page.fill('#name', testName);
        await page.fill('#template', 'hardimpactdev/craft-starterkit');
        await page.waitForTimeout(4000);

        // Submit
        await page.click('button:has-text("Create Site")');

        // Should redirect to sites list
        await page.waitForURL(/\/sites/);
        await expect(page.locator(`text=${testName}`)).toBeVisible();
    });

    test('shows provisioning status after submission', async ({ page }) => {
        const testName = `e2e-status-${Date.now()}`;

        await page.goto('/environments/1/sites/create');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        await page.fill('#name', testName);
        await page.fill('#template', 'hardimpactdev/craft-starterkit');
        await page.waitForTimeout(4000);

        await page.click('button:has-text("Create Site")');
        await page.waitForURL(/\/sites/);

        // Should show success toast
        await expect(page.locator('text=is being created')).toBeVisible();

        // Should show site in list with status
        const siteRow = page.locator(`tr:has-text("${testName}")`);
        await expect(siteRow).toBeVisible();
    });
});

test.describe('Site Creation Completion', () => {
    test('completes site creation with template', async ({ page }) => {
        test.setTimeout(120000); // 2 minute timeout

        const testName = `e2e-complete-${Date.now()}`;

        await page.goto('/environments/1/sites/create');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        await page.fill('#name', testName);
        await page.fill('#template', 'hardimpactdev/craft-starterkit');
        await page.waitForTimeout(4000);

        await page.click('button:has-text("Create Site")');
        await page.waitForURL(/\/sites/);

        // Poll for completion (max 90 seconds)
        let completed = false;
        for (let i = 0; i < 18; i++) {
            await page.reload();
            await page.waitForLoadState('networkidle');

            const siteRow = page.locator(`tr:has-text("${testName}")`);

            if (await siteRow.isVisible()) {
                const hasProgress =
                    (await siteRow.locator('text=Initializing').isVisible()) ||
                    (await siteRow.locator('text=Cloning').isVisible()) ||
                    (await siteRow.locator('text=Setting up').isVisible()) ||
                    (await siteRow.locator('text=Creating').isVisible());

                if (!hasProgress) {
                    // Check for GitHub repo link (indicates completion)
                    const hasRepoLink = await siteRow.locator('a[href*="github.com"]').isVisible();
                    if (hasRepoLink) {
                        completed = true;
                        break;
                    }
                }
            }

            await page.waitForTimeout(5000);
        }

        expect(completed).toBe(true);
    });
});
