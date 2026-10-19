import { describe, expect, it } from 'vitest';
import { basePrefix, joinBase, stripBase } from '../../src/lib/paths';

describe('lib/paths', () => {
  it('la base raíz no cambia las rutas', () => {
    expect(joinBase('/', '/terminos')).toBe('/terminos');
    expect(joinBase('/', '/')).toBe('/');
    expect(stripBase('/', '/terminos')).toBe('/terminos');
  });

  it('antepone el subdirectorio con o sin barra final', () => {
    expect(joinBase('/soat', '/terminos')).toBe('/soat/terminos');
    expect(joinBase('/soat/', '/terminos')).toBe('/soat/terminos');
    expect(joinBase('/soat', '/')).toBe('/soat/');
    expect(basePrefix('/soat/')).toBe('/soat');
  });

  it('quita el subdirectorio de una ruta recibida', () => {
    expect(stripBase('/soat', '/soat/terminos.html')).toBe('/terminos.html');
    expect(stripBase('/soat/', '/soat/')).toBe('/');
    expect(stripBase('/soat', '/soat')).toBe('/');
    expect(stripBase('/soat', '/otra')).toBe('/otra');
  });

  it('rechaza rutas que no empiezan con «/»', () => {
    expect(() => joinBase('/soat', 'terminos')).toThrow();
  });
});
