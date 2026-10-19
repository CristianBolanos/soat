import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';

const INDEX = 'dist/index.html';

describe('build: dist/index.html', () => {
  it('existe (ejecuta `pnpm build` antes de estas pruebas)', () => {
    expect(existsSync(INDEX)).toBe(true);
  });

  const html = existsSync(INDEX) ? readFileSync(INDEX, 'utf8') : '';
  const doc = parse(html);

  it('declara el idioma es-CO', () => {
    expect(doc.querySelector('html')?.getAttribute('lang')).toBe('es-CO');
  });

  it('tiene exactamente un h1', () => {
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
  });

  it('incluye la Content Security Policy generada por Astro', () => {
    const csp = doc.querySelector('meta[http-equiv="content-security-policy"]');
    expect(csp?.getAttribute('content')).toContain("default-src 'self'");
  });

  it('no carga hojas de estilo ni scripts de terceros', () => {
    const external = doc
      .querySelectorAll('link[rel="stylesheet"], script[src]')
      .map((el) => el.getAttribute('href') ?? el.getAttribute('src') ?? '')
      .filter((url) => /^https?:\/\//.test(url));
    expect(external).toEqual([]);
  });
});
