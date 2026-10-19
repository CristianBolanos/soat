import { expect, test } from '@playwright/test';

test.describe('hero y cotizador en móvil (360×740)', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('el cotizador completo se ve sin hacer scroll', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('button', { name: 'Cotizar por WhatsApp' });
    await expect(cta).toBeInViewport();
    const box = await cta.boundingBox();
    expect(box && box.y + box.height).toBeLessThanOrEqual(740);
    // El radio nativo es sr-only; lo visible es su etiqueta.
    await expect(page.locator('label:has(input[value="moto"])')).toBeInViewport();
    await expect(page.getByLabel('Placa del vehículo')).toBeInViewport();
  });

  test('no hay scroll horizontal', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});

test('la imagen principal tiene prioridad alta, dimensiones y texto alternativo', async ({
  page,
}) => {
  await page.goto('/');
  const img = page.locator('#hero picture img');
  await expect(img).toHaveAttribute('fetchpriority', 'high');
  await expect(img).toHaveAttribute('loading', 'eager');
  await expect(img).toHaveAttribute('width', /\d+/);
  await expect(img).toHaveAttribute('height', /\d+/);
  await expect(img).toHaveAttribute('alt', /placa/);
  await expect(page.locator('#hero picture source[type="image/avif"]')).toHaveCount(1);
  await expect(page.locator('#hero picture source[type="image/webp"]')).toHaveCount(1);
});

test('el formulario sin JavaScript apunta a wa.me con un mensaje genérico', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('#cotizador-pasos');
  await expect(form).toHaveAttribute('action', 'https://wa.me/573167341074');
  await expect(form.locator('input[name="text"]')).toHaveValue(/cotizar mi SOAT/);
});
