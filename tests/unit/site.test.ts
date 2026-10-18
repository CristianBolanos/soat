import { describe, expect, it } from 'vitest';
import { site } from '../../src/config/site';

describe('config/site', () => {
  it('usa un número de WhatsApp en formato internacional, solo dígitos', () => {
    expect(site.contact.whatsapp).toMatch(/^57\d{10}$/);
  });

  it('mantiene teléfono y WhatsApp sincronizados', () => {
    expect(site.contact.phone).toBe(`+${site.contact.whatsapp}`);
  });

  it('muestra el mismo número que usa en los enlaces', () => {
    const digits = site.contact.phoneDisplay.replace(/\D/g, '');
    expect(digits).toBe(site.contact.whatsapp);
  });

  it('tiene un correo de contacto válido', () => {
    expect(site.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('usa la zona horaria de Colombia', () => {
    expect(site.timeZone).toBe('America/Bogota');
  });
});
