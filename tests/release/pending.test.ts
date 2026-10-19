/**
 * Puerta de lanzamiento (F11): el sitio no se publica mientras queden datos
 * marcados como «[PENDIENTE…]» (p. ej. el responsable de la política de datos,
 * Ley 1581). Se corre con `pnpm test:release` antes del despliegue a producción.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const pages = readdirSync('dist').filter((file) => file.endsWith('.html'));

describe('listo para publicar', () => {
  for (const page of pages) {
    it(`${page} no tiene datos pendientes`, () => {
      const pending = readFileSync(`dist/${page}`, 'utf8').match(/\[PENDIENTE[^\]]*\]/g) ?? [];
      expect(pending).toEqual([]);
    });
  }
});
