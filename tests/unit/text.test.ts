import { describe, expect, it } from 'vitest';
import { site } from '../../src/config/site';
import { NBSP, nbsp } from '../../src/lib/text';

describe('lib/text', () => {
  it('NBSP es el espacio no separable U+00A0', () => {
    expect(NBSP.charCodeAt(0)).toBe(0xa0);
  });

  it('nbsp reemplaza todos los espacios normales', () => {
    expect(nbsp('(+57) 316 734 1074')).toBe(`(+57)${NBSP}316${NBSP}734${NBSP}1074`);
    expect(nbsp('Llamar ahora')).not.toContain(' ');
  });

  it('el teléfono visible no se parte entre líneas', () => {
    expect(site.contact.phoneDisplay).not.toContain(' ');
    expect(site.contact.phoneDisplay).toContain(NBSP);
  });
});
