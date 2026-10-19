import { expect, test } from '@playwright/test';

const GOOGLE = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com/;

test('sin PUBLIC_GA4_ID no se descarga nada de Google, ni siquiera al interactuar', async ({
  page,
}) => {
  test.skip(Boolean(process.env['PUBLIC_GA4_ID']), 'Solo aplica al build sin GA4');
  const googleRequests: string[] = [];
  page.on('request', (request) => {
    if (GOOGLE.test(request.url())) googleRequests.push(request.url());
  });
  await page.goto('/');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.getByLabel('Placa del vehículo').click();
  await page.waitForTimeout(500);
  expect(googleRequests).toEqual([]);
});

test('los eventos quedan en la cola sin datos personales', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Placa del vehículo').fill('ABC12D');
  const queue = await page.evaluate(() => {
    const layer = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? [];
    return JSON.stringify(layer.map((entry) => Array.from(entry)));
  });
  expect(queue).toContain('quote_start');
  expect(queue).not.toContain('ABC12D');
});
