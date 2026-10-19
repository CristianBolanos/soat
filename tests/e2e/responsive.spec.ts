import { expect, test } from '@playwright/test';

const WIDTHS = [320, 360, 390, 768, 1024, 1440, 1920];

for (const width of WIDTHS) {
  test(`sin scroll horizontal a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test.describe('barra fija móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('se oculta con el cotizador a la vista y aparece al bajar', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('[data-mobile-bar]');
    await expect(bar).toHaveAttribute('data-visible', 'false');
    await page.locator('#como-funciona').scrollIntoViewIfNeeded();
    await expect(bar).toHaveAttribute('data-visible', 'true');
    await expect(bar.getByRole('link', { name: 'Cotizar por WhatsApp' })).toBeVisible();
  });

  test('no tapa el final del pie de página', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const credit = page.getByText('Sitio desarrollado por');
    const barBox = await page.locator('[data-mobile-bar]').boundingBox();
    const creditBox = await credit.boundingBox();
    expect(barBox && creditBox && creditBox.y + creditBox.height).toBeLessThanOrEqual(
      barBox?.y ?? 0,
    );
  });

  test('en las páginas legales queda siempre visible', async ({ page }) => {
    await page.goto('/terminos');
    await expect(page.locator('[data-mobile-bar]')).toHaveAttribute('data-visible', 'true');
  });
});

test.describe('en escritorio no hay barra fija', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('la barra no se muestra', async ({ page }) => {
    await page.goto('/');
    await page.locator('#faq').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-mobile-bar]')).toBeHidden();
  });
});
