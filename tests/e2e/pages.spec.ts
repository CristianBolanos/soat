import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', h1: /Tu SOAT \d{4} para moto o carro/ },
  { path: '/politica-de-datos', h1: 'Política de tratamiento de datos personales' },
  { path: '/terminos', h1: 'Términos del servicio' },
];

for (const { path, h1 } of PAGES) {
  test.describe(`página ${path}`, () => {
    test('carga sin errores de consola (incluye violaciones de CSP)', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
      expect(errors).toEqual([]);
    });

    for (const scheme of ['light', 'dark'] as const) {
      test(`sin violaciones de accesibilidad en tema ${scheme === 'light' ? 'claro' : 'oscuro'}`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(path);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        expect(results.violations).toEqual([]);
      });
    }
  });
}

test('una ruta inexistente muestra la página 404', async ({ page }) => {
  const response = await page.goto('/esta-pagina-no-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta página no existe');
  await expect(page.getByRole('link', { name: 'Ir al inicio', exact: true })).toHaveAttribute(
    'href',
    '/',
  );
});

test('el pie enlaza a las páginas legales', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Política de tratamiento de datos' }).click();
  await expect(page).toHaveURL(/\/politica-de-datos$/);
  await page.getByRole('link', { name: 'Términos del servicio' }).click();
  await expect(page).toHaveURL(/\/terminos$/);
});

test('el FAQ se abre con el teclado', async ({ page }) => {
  await page.goto('/');
  const summary = page.locator('#faq summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#faq details').first()).toHaveAttribute('open', '');
  await expect(
    page.getByText(/te confirmamos el valor exacto antes de que pagues/).first(),
  ).toBeVisible();
});

test('el enlace «Saltar al contenido» se ve al recibir foco y lleva al contenido', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  if (browserName === 'webkit') {
    // Safari, por defecto, solo tabula controles de formulario: se enfoca directamente.
    await skip.focus();
  } else {
    await page.keyboard.press('Tab');
  }
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await expect(skip).toHaveAttribute('href', '#contenido');
  await expect(page.locator('#contenido')).toHaveCount(1);
});

test.describe('anclas del encabezado (escritorio)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('cada ancla lleva a su sección', async ({ page }) => {
    await page.goto('/');
    const anchors = [
      ['¿Cuánto cuesta?', 'tarifas'],
      ['Cómo funciona', 'como-funciona'],
      ['Preguntas', 'faq'],
    ] as const;
    for (const [name, id] of anchors) {
      await page.getByRole('navigation', { name: 'Secciones' }).getByRole('link', { name }).click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });
});
