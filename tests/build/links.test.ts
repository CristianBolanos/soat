import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';

const PAGES = ['index', 'politica-de-datos', 'terminos', '404'];
const read = (page: string) => parse(readFileSync(`dist/${page}.html`, 'utf8'));
const index = existsSync('dist/index.html') ? read('index') : parse('');

/** Anclas del sitio anterior que deben seguir funcionando (docs/paridad.md, fila 25). */
const LEGACY_ANCHORS = [
  'hero',
  'cotizador-pasos',
  'beneficios',
  'tarifas',
  'como-funciona',
  'verificacion',
  'antifraude',
  'faq',
];

describe('build: enlaces y anclas', () => {
  it('existen todas las páginas', () => {
    for (const page of PAGES) expect(existsSync(`dist/${page}.html`)).toBe(true);
  });

  it('conserva las anclas del sitio anterior', () => {
    const missing = LEGACY_ANCHORS.filter((id) => !index.getElementById(id));
    expect(missing).toEqual([]);
  });

  it('cada enlace interno con # apunta a un id que existe', () => {
    const ids = new Set(index.querySelectorAll('[id]').map((el) => el.id));
    const broken = index
      .querySelectorAll('a[href^="#"]')
      .map((a) => a.getAttribute('href')?.slice(1) ?? '')
      .filter((id) => !ids.has(id));
    expect(broken).toEqual([]);
  });

  it('los enlaces a otras páginas del sitio existen en dist/', () => {
    for (const page of PAGES) {
      const broken = read(page)
        .querySelectorAll('a[href^="/"]')
        .map((a) => (a.getAttribute('href') ?? '').split('#')[0] ?? '')
        .filter((path) => path !== '/' && !existsSync(`dist${path}.html`));
      expect({ page, broken }).toEqual({ page, broken: [] });
    }
  });
});

describe('build: contacto y enlaces externos', () => {
  for (const page of PAGES) {
    const doc = existsSync(`dist/${page}.html`) ? read(page) : parse('');

    it(`${page}: todos los enlaces de WhatsApp usan el número y la etiqueta de origen`, () => {
      const links = doc
        .querySelectorAll('a[href^="https://wa.me/"]')
        .map((a) => a.getAttribute('href') ?? '');
      expect(links.length).toBeGreaterThan(0);
      for (const href of links) {
        expect(href.startsWith('https://wa.me/573167341074?text=')).toBe(true);
        expect(decodeURIComponent(href)).toContain('[web]');
      }
    });

    it(`${page}: todos los enlaces tel: usan el mismo número`, () => {
      const tels = new Set(
        doc.querySelectorAll('a[href^="tel:"]').map((a) => a.getAttribute('href')),
      );
      expect([...tels]).toEqual(['tel:+573167341074']);
    });

    it(`${page}: los enlaces que abren otra pestaña llevan rel="noopener noreferrer"`, () => {
      const unsafe = doc
        .querySelectorAll('a[target="_blank"]')
        .filter((a) => !/noopener/.test(a.getAttribute('rel') ?? ''));
      expect(unsafe.map((a) => a.getAttribute('href'))).toEqual([]);
    });
  }
});

describe('build: contenido visible', () => {
  it('el FAQ visible tiene las preguntas de data/faq.ts', async () => {
    const { faq } = await import('../../src/data/faq');
    const shown = index.querySelectorAll('#faq summary').map((s) => s.text.trim());
    expect(shown).toEqual(faq.map((f) => f.question));
  });

  it('la página 404 no se indexa', () => {
    expect(read('404').querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex',
    );
  });

  it('la portada tiene un solo h1 y los títulos de sección son h2', () => {
    expect(index.querySelectorAll('h1')).toHaveLength(1);
    expect(index.querySelectorAll('main h2').length).toBeGreaterThanOrEqual(5);
  });
});
