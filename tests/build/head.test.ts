import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';

const html = existsSync('dist/index.html') ? readFileSync('dist/index.html', 'utf8') : '';
const doc = parse(html);
const head = html.slice(0, html.indexOf('</head>'));

describe('build: <head> de la página principal', () => {
  it('tiene título y descripción con el año actual (calculado al compilar)', () => {
    const year = String(new Date().getFullYear());
    expect(doc.querySelector('title')?.text).toContain(`SOAT ${year}`);
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toContain(year);
  });

  it('fija el tema antes del primer pintado (script en línea dentro de <head>)', () => {
    expect(head).toContain('document.documentElement.dataset.theme');
    expect(head.indexOf('dataset.theme')).toBeLessThan(head.indexOf('<style'));
  });

  it('declara favicons, ícono de Apple y manifest que existen en dist/', () => {
    for (const href of [
      '/favicon.ico',
      '/favicon.svg',
      '/apple-touch-icon.png',
      '/manifest.webmanifest',
    ]) {
      expect(doc.querySelector(`link[href="${href}"]`)).not.toBeNull();
      expect(existsSync(`dist${href}`)).toBe(true);
    }
  });

  it('declara color-scheme y theme-color para ambos temas', () => {
    expect(doc.querySelector('meta[name="color-scheme"]')?.getAttribute('content')).toBe(
      'light dark',
    );
    expect(doc.querySelectorAll('meta[name="theme-color"]')).toHaveLength(2);
  });

  it('precarga la fuente auto-alojada', () => {
    expect(doc.querySelector('link[rel="preload"][as="font"]')?.getAttribute('href')).toMatch(
      /^\/_astro\/fonts\/.+\.woff2$/,
    );
  });

  it('las imágenes tienen alt, width y height (sin CLS)', () => {
    const imgs = doc.querySelectorAll('img');
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) {
      expect(img.getAttribute('alt')).toBeTruthy();
      expect(img.getAttribute('width')).toMatch(/^\d+$/);
      expect(img.getAttribute('height')).toMatch(/^\d+$/);
    }
  });
});
