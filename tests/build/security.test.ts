import { readFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';

/** Cabeceras de la regla `/*` en dist/_headers (formato de Cloudflare Pages). */
function globalHeaders(): Record<string, string> {
  const text = readFileSync('dist/_headers', 'utf8');
  const block = text.split(/\n(?=\/)/).find((section) => section.startsWith('/*')) ?? '';
  return Object.fromEntries(
    block
      .split('\n')
      .slice(1)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf(':');
        return [line.slice(0, index).toLowerCase(), line.slice(index + 1).trim()];
      }),
  );
}

describe('cabeceras de seguridad (dist/_headers)', () => {
  const headers = globalHeaders();

  it('HSTS de al menos un año', () => {
    const maxAge = Number(/max-age=(\d+)/.exec(headers['strict-transport-security'] ?? '')?.[1]);
    expect(maxAge).toBeGreaterThanOrEqual(31_536_000);
  });

  it('impide que el sitio se cargue dentro de un iframe ajeno', () => {
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-frame-options']).toBe('DENY');
  });

  it('declara nosniff, Referrer-Policy, Permissions-Policy y COOP', () => {
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['permissions-policy']).toContain('geolocation=()');
    expect(headers['cross-origin-opener-policy']).toBe('same-origin');
  });

  it('los recursos con hash se guardan en caché como inmutables', () => {
    expect(readFileSync('dist/_headers', 'utf8')).toMatch(
      /\/_astro\/\*\s+Cache-Control: public, max-age=31536000, immutable/,
    );
  });
});

describe('Content Security Policy (meta generada por Astro)', () => {
  const csp =
    parse(readFileSync('dist/index.html', 'utf8'))
      .querySelector('meta[http-equiv="content-security-policy"]')
      ?.getAttribute('content') ?? '';

  it('no permite scripts ni estilos en línea sin hash', () => {
    expect(csp).not.toContain("'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('solo permite enviar formularios al propio sitio y a WhatsApp', () => {
    expect(csp).toContain("form-action 'self' https://wa.me https://api.whatsapp.com");
  });

  it('sin PUBLIC_GA4_ID no autoriza dominios de Google (mínimo privilegio)', () => {
    if (process.env['PUBLIC_GA4_ID']) return;
    expect(csp).not.toContain('googletagmanager');
    expect(csp).not.toContain('google-analytics');
  });

  it('autoriza Cloudflare Web Analytics (sin cookies)', () => {
    expect(csp).toContain('https://static.cloudflareinsights.com');
  });
});
