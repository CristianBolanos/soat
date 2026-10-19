/**
 * Puerta de lanzamiento (F11, decisión D6): la política de datos debe identificar al
 * responsable con los datos que exige el Decreto 1377 de 2013 (art. 13): nombre,
 * domicilio, dirección, correo y teléfono, más la fecha de entrada en vigencia.
 */
import { describe, expect, it } from 'vitest';
import { site } from '../../src/config/site';

const filled = (value: string | null) => typeof value === 'string' && value.trim().length > 0;

describe('datos del responsable listos para publicar', () => {
  it('tiene el nombre del responsable (persona o razón social)', () => {
    expect(filled(site.legal.responsibleName)).toBe(true);
  });

  it('tiene el domicilio (ciudad y departamento)', () => {
    expect(filled(site.legal.city)).toBe(true);
  });

  it('tiene la dirección para notificaciones', () => {
    expect(filled(site.legal.address)).toBe(true);
  });

  it('tiene correo y teléfono de contacto', () => {
    expect(site.legal.requestsEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(site.contact.phone).toMatch(/^\+57\d{10}$/);
  });

  it('tiene la fecha de entrada en vigencia (AAAA-MM-DD)', () => {
    expect(site.legal.policyDate ?? '').toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
