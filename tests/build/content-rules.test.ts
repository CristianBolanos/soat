import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** Todas las páginas HTML generadas en dist/. */
function htmlFiles(dir = 'dist'): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

/** Texto sin <style>: el CSS en línea no es contenido. */
function contentOf(file: string): string {
  return readFileSync(file, 'utf8').replace(/<style[\s\S]*?<\/style>/g, '');
}

/**
 * R44: no se nombran aseguradoras (los proveedores cambian). Se buscan nombres
 * completos y con mayúsculas para no confundir palabras comunes (p. ej. «equidad»).
 */
const INSURERS = [
  'SURA',
  'Suramericana',
  'Seguros Bolívar',
  'Seguros Mundial',
  'Previsora',
  'AXA',
  'Colpatria',
  'Allianz',
  'Mapfre',
  'MAPFRE',
  'Liberty Seguros',
  'HDI Seguros',
  'La Equidad',
  'Aseguradora Solidaria',
  'Seguros del Estado',
  'Positiva Compañía de Seguros',
  'Qualitas',
  'Zurich',
  'SBS Seguros',
  'Seguros Falabella',
];

/** D5: no se publican precios. Formato colombiano: $343.300, $ 1.121.400, COP 447300. */
const PRICE = /(\$\s?\d{1,3}(\.\d{3})+)|(\bCOP\s?\d)/;

describe('reglas de contenido en dist/', () => {
  const files = htmlFiles();

  it('hay páginas para revisar', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const content = contentOf(file);

    it(`${file}: no nombra aseguradoras (R44)`, () => {
      const found = INSURERS.filter((name) => new RegExp(`\\b${name}\\b`).test(content));
      expect(found).toEqual([]);
    });

    it(`${file}: no publica precios (D5)`, () => {
      expect(content.match(PRICE)?.[0] ?? null).toBeNull();
    });
  }
});
