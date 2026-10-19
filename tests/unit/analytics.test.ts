import { afterEach, describe, expect, it, vi } from 'vitest';
import { eventPayload, isEventName, sanitizeParams, track } from '../../src/lib/analytics';

describe('lib/analytics: sin datos personales', () => {
  it('descarta parámetros fuera de la lista permitida (placa, teléfono)', () => {
    expect(sanitizeParams({ tipo: 'moto', placa: 'ABC12D', telefono: '3167341074' })).toEqual({
      tipo: 'moto',
    });
  });

  it('descarta valores que no son slugs en minúscula (una placa en un parámetro permitido)', () => {
    expect(sanitizeParams({ ubicacion: 'ABC12D', origen: 'web' })).toEqual({ origen: 'web' });
  });

  it('acepta números pequeños (número de pregunta del FAQ)', () => {
    expect(sanitizeParams({ pregunta: 3 })).toEqual({ pregunta: 3 });
    expect(sanitizeParams({ pregunta: 3167341074 })).toEqual({});
  });

  it('envía por beacon los eventos que salen de la página', () => {
    expect(eventPayload('generate_lead', { tipo: 'carro' })).toEqual({
      tipo: 'carro',
      transport_type: 'beacon',
    });
    expect(eventPayload('faq_open', { pregunta: 1 })).toEqual({ pregunta: 1 });
  });

  it('reconoce solo eventos definidos', () => {
    expect(isEventName('generate_lead')).toBe(true);
    expect(isEventName('compra')).toBe(false);
  });
});

describe('track', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('encola el evento con la firma de gtag', () => {
    const win: { dataLayer?: unknown[] } = {};
    vi.stubGlobal('window', win);
    track('generate_lead', { tipo: 'moto', placa: 'ABC12D' });
    const entry = win.dataLayer?.[0] as ArrayLike<unknown>;
    expect(Array.from(entry)).toEqual([
      'event',
      'generate_lead',
      { tipo: 'moto', transport_type: 'beacon' },
    ]);
  });

  it('nunca lanza errores aunque no exista window', () => {
    vi.stubGlobal('window', undefined);
    expect(() => track('quote_start')).not.toThrow();
  });
});
