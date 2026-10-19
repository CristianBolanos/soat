import { describe, expect, it } from 'vitest';
import { currentYear, formatLongDate } from '../../src/lib/dates';

describe('lib/dates: currentYear', () => {
  it('devuelve el año de la fecha dada', () => {
    expect(currentYear('America/Bogota', new Date('2026-06-15T12:00:00Z'))).toBe(2026);
  });

  it('usa la hora de Colombia en el cambio de año (UTC-5)', () => {
    // 1 de enero a las 03:00 UTC = 31 de diciembre a las 22:00 en Bogotá.
    expect(currentYear('America/Bogota', new Date('2027-01-01T03:00:00Z'))).toBe(2026);
    // 1 de enero a las 06:00 UTC = 1 de enero a la 01:00 en Bogotá.
    expect(currentYear('America/Bogota', new Date('2027-01-01T06:00:00Z'))).toBe(2027);
  });

  it('usa Colombia por defecto', () => {
    expect(currentYear(undefined, new Date('2030-03-01T00:00:00Z'))).toBe(2030);
  });
});

describe('lib/dates: formatLongDate', () => {
  it('escribe la fecha en español de Colombia', () => {
    expect(formatLongDate('2026-10-18')).toBe('18 de octubre de 2026');
  });

  it('no se corre un día por la zona horaria', () => {
    expect(formatLongDate('2027-01-01')).toBe('1 de enero de 2027');
  });
});
