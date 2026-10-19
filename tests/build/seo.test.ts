import { existsSync, readFileSync } from 'node:fs';
import { parse, type HTMLElement } from 'node-html-parser';
import { describe, expect, it } from 'vitest';

const SITE = 'https://soat-ya.pages.dev';
const INDEXABLE = [
  { file: 'index', url: `${SITE}/` },
  { file: 'politica-de-datos', url: `${SITE}/politica-de-datos` },
  { file: 'terminos', url: `${SITE}/terminos` },
];
const load = (file: string) =>
  existsSync(`dist/${file}.html`) ? parse(readFileSync(`dist/${file}.html`, 'utf8')) : parse('');
const meta = (doc: HTMLElement, selector: string) =>
  doc.querySelector(selector)?.getAttribute('content');

describe('SEO por página', () => {
  for (const { file, url } of INDEXABLE) {
    const doc = load(file);

    it(`${file}: canonical absoluto y limpio, igual a og:url`, () => {
      expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(url);
      expect(meta(doc, 'meta[property="og:url"]')).toBe(url);
    });

    it(`${file}: Open Graph y X Cards completos`, () => {
      expect(meta(doc, 'meta[property="og:type"]')).toBe('website');
      expect(meta(doc, 'meta[property="og:site_name"]')).toBe('SOAT YA');
      expect(meta(doc, 'meta[property="og:locale"]')).toBe('es_CO');
      expect(meta(doc, 'meta[property="og:image"]')).toBe(`${SITE}/og-image.png`);
      expect(meta(doc, 'meta[property="og:image:alt"]')).toBeTruthy();
      expect(meta(doc, 'meta[name="twitter:card"]')).toBe('summary_large_image');
      expect(meta(doc, 'meta[name="twitter:image"]')).toBe(`${SITE}/og-image.png`);
      expect(meta(doc, 'meta[property="og:title"]')).toBe(doc.querySelector('title')?.text);
    });

    it(`${file}: title de hasta 65 caracteres y description de 50 a 160`, () => {
      expect(doc.querySelector('title')?.text.length ?? 0).toBeLessThanOrEqual(65);
      const description = meta(doc, 'meta[name="description"]') ?? '';
      expect(description.length).toBeGreaterThanOrEqual(50);
      expect(description.length).toBeLessThanOrEqual(160);
    });
  }

  it('cada página tiene title y description propios', () => {
    const titles = INDEXABLE.map(({ file }) => load(file).querySelector('title')?.text);
    const descriptions = INDEXABLE.map(({ file }) => meta(load(file), 'meta[name="description"]'));
    expect(new Set(titles).size).toBe(INDEXABLE.length);
    expect(new Set(descriptions).size).toBe(INDEXABLE.length);
  });

  it('la imagen OG existe y mide 1200×630', () => {
    const png = readFileSync('dist/og-image.png');
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });

  it('la 404 no tiene canonical y no se indexa', () => {
    const doc = load('404');
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull();
    expect(meta(doc, 'meta[name="robots"]')).toBe('noindex');
  });
});

describe('JSON-LD de la portada', () => {
  const doc = load('index');
  const raw = doc.querySelector('script[type="application/ld+json"]')?.text ?? '{}';
  const data = JSON.parse(raw) as { '@graph'?: Record<string, unknown>[] };
  const nodes = data['@graph'] ?? [];

  it('declara Organization, WebSite, WebPage y FAQPage', () => {
    expect(nodes.map((n) => n['@type'])).toEqual(['Organization', 'WebSite', 'WebPage', 'FAQPage']);
  });

  it('el FAQPage coincide con las preguntas visibles', () => {
    const faqNode = nodes.find((n) => n['@type'] === 'FAQPage') as {
      mainEntity: { name: string }[];
    };
    const visible = doc.querySelectorAll('#faq summary').map((s) => s.text.trim());
    expect(faqNode.mainEntity.map((q) => q.name)).toEqual(visible);
  });

  it('no publica precios ni ofertas (D5)', () => {
    expect(raw).not.toMatch(/"price"|"Offer"|"priceCurrency"/);
  });
});

describe('sitemap y robots', () => {
  const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it('el sitemap lista solo las páginas indexables', () => {
    expect(locs.sort()).toEqual(INDEXABLE.map((p) => p.url).sort());
  });

  it('robots.txt permite todo y apunta al sitemap absoluto', () => {
    const robots = readFileSync('dist/robots.txt', 'utf8');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
  });
});
