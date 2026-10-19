import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const themeOf = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.dataset['theme']);

test.describe('tema claro/oscuro', () => {
  test('sin preferencia del sistema arranca en claro', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'no-preference' });
    await page.goto('/');
    expect(await themeOf(page)).toBe('light');
  });

  test('respeta la preferencia clara del sistema', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    expect(await themeOf(page)).toBe('light');
  });

  test('respeta la preferencia oscura del sistema', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    expect(await themeOf(page)).toBe('dark');
    await expect(page.getByRole('button', { name: 'Activar tema claro' })).toBeVisible();
  });

  test('el botón cambia el tema y la elección se recuerda al recargar', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.getByRole('button', { name: 'Activar tema oscuro' }).click();
    expect(await themeOf(page)).toBe('dark');
    await expect(page.getByRole('button', { name: 'Activar tema claro' })).toBeVisible();
    await page.reload();
    expect(await themeOf(page)).toBe('dark');
  });

  test('sin accesibilidad rota en tema oscuro (axe)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });
});
