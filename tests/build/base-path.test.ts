/**
 * Base de despliegue: con DEPLOY_BASE=soat (GitHub Pages, https://…github.io/soat/) todo
 * enlace o archivo propio debe llevar el prefijo /soat; sin la variable (Cloudflare Pages)
 * no debe quedar ningún prefijo. El canonical siempre es la dirección principal.
 * El workflow de GitHub Pages corre este archivo después de compilar con la base.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';

const raw = (process.env['DEPLOY_BASE'] ?? '').replace(/^\/+|\/+$/g, '');
const prefix = raw ? `/${raw}` : '';
const PAGES = existsSync('dist') ? readdirSync('dist').filter((f) => f.endsWith('.html')) : [];

/** Rutas propias (empiezan con «/», no con «//») de href, src, srcset y action. */
function ownUrls(html: string): string[] {
  const doc = parse(html);
  const attrs = ['href', 'src', 'action'];
  const list = attrs.flatMap((a) =>
    doc.querySelectorAll(`[${a}]`).map((el) => el.getAttribute(a) ?? ''),
  );
  const srcsets = doc
    .querySelectorAll('[srcset]')
    .flatMap((el) =>
      (el.getAttribute('srcset') ?? '').split(',').map((s) => s.trim().split(' ')[0] ?? ''),
    );
  const cssUrls = [...html.matchAll(/url\(["']?([^)"']+)["']?\)/g)].map((m) => m[1] ?? '');
  return [...list, ...srcsets, ...cssUrls].filter((u) => u.startsWith('/') && !u.startsWith('//'));
}

describe(`build con base «${prefix || '/'}»`, () => {
  it('hay páginas compiladas', () => {
    expect(PAGES.length).toBeGreaterThanOrEqual(4);
  });

  for (const page of PAGES) {
    it(`${page}: todas las rutas propias llevan la base`, () => {
      const urls = ownUrls(readFileSync(`dist/${page}`, 'utf8'));
      expect(urls.length).toBeGreaterThan(3);
      const bad = urls.filter((u) =>
        prefix ? u !== prefix && !u.startsWith(`${prefix}/`) : u.startsWith('/soat/'),
      );
      expect(bad).toEqual([]);
    });

    it(`${page}: los archivos enlazados existen en dist/`, () => {
      const missing = ownUrls(readFileSync(`dist/${page}`, 'utf8'))
        .map((u) => decodeURIComponent(u.split('#')[0]?.split('?')[0] ?? ''))
        .map((u) => (prefix && u.startsWith(prefix) ? u.slice(prefix.length) : u) || '/')
        .filter((u) => u !== '/' && !existsSync(`dist${u}`) && !existsSync(`dist${u}.html`));
      expect(missing).toEqual([]);
    });

    it(`${page}: el canonical apunta a la dirección principal, sin la base`, () => {
      const canonical = parse(readFileSync(`dist/${page}`, 'utf8'))
        .querySelector('link[rel="canonical"]')
        ?.getAttribute('href');
      if (page === '404.html') return; // la 404 lleva noindex
      expect(canonical).toMatch(/^https:\/\/soatya\.pages\.dev\/[a-z-]*$/);
    });
  }

  it('el manifest usa la base en start_url e íconos', () => {
    const manifest = JSON.parse(readFileSync('dist/manifest.webmanifest', 'utf8')) as {
      start_url: string;
      icons: { src: string }[];
    };
    expect(manifest.start_url).toBe(`${prefix}/`);
    for (const icon of manifest.icons) expect(icon.src.startsWith(`${prefix}/`)).toBe(true);
  });
});
