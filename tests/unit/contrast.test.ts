import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Tokens `--nombre: #hex;` de un bloque CSS. */
function tokensOf(block: string): Record<string, string> {
  const entries = [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(
    (m) => [m[1] ?? '', (m[2] ?? '').toLowerCase()] as const,
  );
  return Object.fromEntries(entries);
}

/** Cuerpo `{ ... }` que sigue a un selector (sin llaves anidadas). */
function blockAfter(css: string, selector: string): string {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`No se encontró ${selector}`);
  const open = css.indexOf('{', start);
  return css.slice(open + 1, css.indexOf('}', open));
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

/** Relación de contraste WCAG 2.x. */
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

const css = readFileSync('src/styles/global.css', 'utf8');
const light = tokensOf(blockAfter(css, ':root {'));
const darkMedia = tokensOf(blockAfter(css, ":root:not([data-theme='light'])"));
const darkAttr = tokensOf(blockAfter(css, ":root[data-theme='dark']"));
const dark = { ...light, ...darkAttr };

/** Pares texto/fondo que deben cumplir WCAG AA (4,5:1 para texto normal). */
const PAIRS: [foreground: string, background: string][] = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['text-muted', 'bg'],
  ['text-muted', 'surface'],
  ['brand', 'bg'],
  ['brand', 'surface'],
  ['on-cta', 'cta'],
  ['on-wa', 'wa'],
  ['danger', 'bg'],
  ['success', 'bg'],
];

describe('tokens de color: contraste WCAG AA', () => {
  for (const [theme, tokens] of [
    ['claro', light],
    ['oscuro', dark],
  ] as const) {
    for (const [fg, bg] of PAIRS) {
      it(`${theme}: --${fg} sobre --${bg} ≥ 4,5:1`, () => {
        const ratio = contrast(tokens[fg] ?? '', tokens[bg] ?? '');
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('el tema oscuro es igual por preferencia del sistema y por elección guardada', () => {
    expect(darkMedia).toEqual(darkAttr);
  });

  it('el anillo de foco (--brand) se distingue del fondo (≥ 3:1) en ambos temas', () => {
    expect(contrast(light['brand'] ?? '', light['bg'] ?? '')).toBeGreaterThanOrEqual(3);
    expect(contrast(dark['brand'] ?? '', dark['bg'] ?? '')).toBeGreaterThanOrEqual(3);
  });
});
