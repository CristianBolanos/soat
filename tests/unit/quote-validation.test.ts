import { describe, expect, it } from 'vitest';
import {
  inferVehicle,
  isVehicleType,
  normalizePlate,
  validateQuote,
} from '../../src/lib/quote-validation';

describe('normalizePlate', () => {
  it('pasa a mayúsculas y quita espacios, guiones y símbolos', () => {
    expect(normalizePlate(' abc-12d ')).toBe('ABC12D');
    expect(normalizePlate('abc 123')).toBe('ABC123');
  });

  it('limita a 7 caracteres', () => {
    expect(normalizePlate('ABCD12345')).toBe('ABCD123');
  });
});

describe('inferVehicle', () => {
  it('reconoce placas de moto (AAA00A)', () => {
    expect(inferVehicle('ABC12D')).toBe('moto');
  });

  it('reconoce placas de carro (AAA000)', () => {
    expect(inferVehicle('ABC123')).toBe('carro');
  });

  it('devuelve null para formatos no estándar', () => {
    expect(inferVehicle('AB1234')).toBeNull();
    expect(inferVehicle('ABC12')).toBeNull();
  });
});

describe('validateQuote', () => {
  it('bloquea la placa vacía', () => {
    expect(validateQuote({ vehicle: 'moto', rawPlate: '  ' })).toEqual({
      ok: false,
      error: 'plate-empty',
    });
  });

  it('bloquea la placa demasiado corta', () => {
    expect(validateQuote({ vehicle: 'carro', rawPlate: 'AB1' })).toEqual({
      ok: false,
      error: 'plate-short',
    });
  });

  it('acepta una placa estándar con el tipo elegido', () => {
    expect(validateQuote({ vehicle: 'carro', rawPlate: 'abc123' })).toEqual({
      ok: true,
      vehicle: 'carro',
      plate: 'ABC123',
    });
  });

  it('deduce el tipo si no se eligió (menos fricción)', () => {
    expect(validateQuote({ vehicle: null, rawPlate: 'abc12d' })).toEqual({
      ok: true,
      vehicle: 'moto',
      plate: 'ABC12D',
    });
  });

  it('respeta el tipo elegido aunque la placa parezca de otro tipo', () => {
    expect(validateQuote({ vehicle: 'moto', rawPlate: 'ABC123' })).toMatchObject({
      ok: true,
      vehicle: 'moto',
    });
  });

  it('pide el tipo cuando la placa no es estándar y no se eligió', () => {
    expect(validateQuote({ vehicle: null, rawPlate: 'AB1234' })).toEqual({
      ok: false,
      error: 'vehicle',
    });
  });

  it('avisa (sin bloquear) una placa poco común y continúa si se confirma', () => {
    expect(validateQuote({ vehicle: 'moto', rawPlate: 'ABC12' })).toEqual({
      ok: false,
      error: 'plate-unusual',
    });
    expect(validateQuote({ vehicle: 'moto', rawPlate: 'ABC12', acceptUnusual: true })).toEqual({
      ok: true,
      vehicle: 'moto',
      plate: 'ABC12',
    });
  });

  it('reconoce los tipos válidos', () => {
    expect(isVehicleType('moto')).toBe(true);
    expect(isVehicleType('bus')).toBe(false);
  });
});
