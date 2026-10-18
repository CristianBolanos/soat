import { describe, expect, it } from 'vitest';
import {
  MESSAGES,
  originFromSearch,
  quoteMessage,
  whatsappUrl,
  withOrigin,
} from '../../src/lib/whatsapp';

describe('lib/whatsapp', () => {
  it('arma el mensaje del cotizador con tipo y placa', () => {
    expect(quoteMessage('moto', 'ABC12D')).toBe(
      'Hola, quiero el SOAT de mi moto de placa ABC12D. ¿Me ayudas con el valor?',
    );
  });

  it('agrega la etiqueta de origen', () => {
    expect(withOrigin(MESSAGES.generic, 'web')).toBe('Hola, quiero cotizar mi SOAT. [web]');
  });

  it('detecta visitas de pauta', () => {
    expect(originFromSearch('?gclid=abc')).toBe('ads');
    expect(originFromSearch('?fbclid=abc')).toBe('ads');
    expect(originFromSearch('?utm_source=google&utm_medium=cpc')).toBe('ads');
  });

  it('el resto de visitas son web', () => {
    expect(originFromSearch('')).toBe('web');
    expect(originFromSearch('?utm_source=facebook&utm_medium=social')).toBe('web');
  });

  it('codifica el mensaje en la URL de wa.me', () => {
    const url = whatsappUrl('573167341074', quoteMessage('carro', 'ABC123'));
    expect(url.startsWith('https://wa.me/573167341074?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1] ?? '')).toBe(quoteMessage('carro', 'ABC123'));
    expect(url).not.toMatch(/\s/);
  });

  it('rechaza números con formato inválido', () => {
    expect(() => whatsappUrl('+57 316', 'x')).toThrow();
  });
});
