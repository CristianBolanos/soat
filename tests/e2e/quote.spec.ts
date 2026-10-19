import { expect, test, type Page } from '@playwright/test';

/** Intercepta wa.me (no se abre WhatsApp de verdad) y devuelve el texto del mensaje. */
async function interceptWhatsApp(page: Page) {
  await page.route('https://wa.me/**', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<p>WhatsApp</p>' }),
  );
}

async function sentMessage(page: Page): Promise<string> {
  await page.waitForURL(/^https:\/\/wa\.me\//);
  return new URL(page.url()).searchParams.get('text') ?? '';
}

const plate = (page: Page) => page.getByLabel('Placa del vehículo');
const submit = (page: Page) => page.getByRole('button', { name: 'Cotizar por WhatsApp' });

test.describe('cotizador', () => {
  test.beforeEach(async ({ page }) => {
    await interceptWhatsApp(page);
    await page.goto('/');
  });

  test('sin placa muestra el error y no abre WhatsApp', async ({ page }) => {
    await submit(page).click();
    await expect(page.getByText('Escribe la placa de tu vehículo.')).toBeVisible();
    await expect(plate(page)).toHaveAttribute('aria-invalid', 'true');
    expect(page.url()).not.toContain('wa.me');
  });

  test('deduce «moto» por la placa y envía tipo, placa y origen', async ({ page }) => {
    await plate(page).fill('abc 12d');
    await expect(plate(page)).toHaveValue('ABC12D');
    await expect(page.getByRole('radio', { name: 'Moto' })).toBeChecked();
    await submit(page).click();
    expect(await sentMessage(page)).toBe(
      'Hola, quiero el SOAT de mi moto de placa ABC12D. ¿Me ayudas con el valor? [web]',
    );
  });

  test('respeta el tipo elegido por el visitante', async ({ page }) => {
    await page.locator('label:has(input[value="carro"])').click();
    await plate(page).fill('ABC123');
    await submit(page).click();
    expect(await sentMessage(page)).toContain('mi carro de placa ABC123');
  });

  test('pide el tipo si la placa no es estándar y no se eligió', async ({ page }) => {
    await plate(page).fill('AB1234');
    await submit(page).click();
    await expect(page.getByText('Elige si es moto o carro.')).toBeVisible();
  });

  test('una placa poco común solo avisa: al pulsar de nuevo continúa', async ({ page }) => {
    await page.locator('label:has(input[value="moto"])').click();
    await plate(page).fill('ABC12');
    await submit(page).click();
    await expect(page.getByText(/Revisa la placa/)).toBeVisible();
    await submit(page).click();
    expect(await sentMessage(page)).toContain('placa ABC12.');
  });

  test('registra generate_lead en la analítica sin la placa', async ({ page }) => {
    // Cada evento se reporta en el momento (antes de que la página salga hacia WhatsApp).
    const events: string[] = [];
    await page.exposeFunction('reportarEvento', (entry: string) => events.push(entry));
    await page.addInitScript(() => {
      const w = window as unknown as {
        dataLayer: ArrayLike<unknown>[];
        reportarEvento: (entry: string) => void;
      };
      w.dataLayer = [];
      const push = w.dataLayer.push.bind(w.dataLayer);
      w.dataLayer.push = (...entries: ArrayLike<unknown>[]) => {
        for (const entry of entries) w.reportarEvento(JSON.stringify(Array.from(entry)));
        return push(...entries);
      };
    });
    await page.goto('/');
    await plate(page).fill('ABC123');
    await submit(page).click();
    await expect.poll(() => events.join(' ')).toContain('generate_lead');
    expect(events.join(' ')).not.toContain('ABC123');
  });

  test('los botones de «¿Cuánto cuesta?» preseleccionan el tipo y llevan a la placa', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'Consultar el valor de mi carro' }).click();
    await expect(page.getByRole('radio', { name: 'Carro' })).toBeChecked();
    await expect(plate(page)).toBeFocused();
  });
});

test('con visita de pauta (gclid) el mensaje lleva [ads]', async ({ page }) => {
  await interceptWhatsApp(page);
  await page.goto('/?gclid=prueba');
  await expect(page.locator('footer a[href*="wa.me"]').first()).toHaveAttribute(
    'href',
    /%5Bads%5D/,
  );
  await plate(page).fill('ABC123');
  await submit(page).click();
  expect(await sentMessage(page)).toContain('[ads]');
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('el cotizador igual abre WhatsApp con un mensaje genérico', async ({ page }) => {
    await interceptWhatsApp(page);
    await page.goto('/');
    await plate(page).fill('ABC123');
    await submit(page).click();
    expect(await sentMessage(page)).toBe('Hola, quiero cotizar mi SOAT. [web]');
  });
});
