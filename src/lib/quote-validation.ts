/**
 * Validación del cotizador (plan, F4.4). Pensada para no frenar la conversión:
 * - Solo bloquea una placa vacía o demasiado corta.
 * - Si no se eligió moto o carro, lo deduce del formato de la placa.
 * - Una placa con formato poco común solo genera un aviso: al pulsar de nuevo, continúa.
 */
export type VehicleType = 'moto' | 'carro';

/** Formatos estándar de placas particulares en Colombia. */
export const PLATE_PATTERNS: Record<VehicleType, RegExp> = {
  carro: /^[A-Z]{3}\d{3}$/,
  moto: /^[A-Z]{3}\d{2}[A-Z]$/,
};

export const PLATE_MIN_LENGTH = 5;
export const PLATE_MAX_LENGTH = 7;

export type QuoteError = 'plate-empty' | 'plate-short' | 'vehicle' | 'plate-unusual';

export type QuoteResult =
  { ok: true; vehicle: VehicleType; plate: string } | { ok: false; error: QuoteError };

export interface QuoteInput {
  vehicle: VehicleType | null;
  rawPlate: string;
  /** El visitante ya vio el aviso de formato poco común y decidió continuar. */
  acceptUnusual?: boolean;
}

export function isVehicleType(value: unknown): value is VehicleType {
  return value === 'moto' || value === 'carro';
}

/** Mayúsculas, solo letras y números, máximo 7 caracteres. */
export function normalizePlate(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, PLATE_MAX_LENGTH);
}

/** Tipo de vehículo según el formato de la placa, o null si no es un formato estándar. */
export function inferVehicle(plate: string): VehicleType | null {
  if (PLATE_PATTERNS.moto.test(plate)) return 'moto';
  if (PLATE_PATTERNS.carro.test(plate)) return 'carro';
  return null;
}

export function validateQuote({
  vehicle,
  rawPlate,
  acceptUnusual = false,
}: QuoteInput): QuoteResult {
  const plate = normalizePlate(rawPlate);
  if (plate.length === 0) return { ok: false, error: 'plate-empty' };
  if (plate.length < PLATE_MIN_LENGTH) return { ok: false, error: 'plate-short' };

  const inferred = inferVehicle(plate);
  const resolved = vehicle ?? inferred;
  if (!resolved) return { ok: false, error: 'vehicle' };
  if (!inferred && !acceptUnusual) return { ok: false, error: 'plate-unusual' };
  return { ok: true, vehicle: resolved, plate };
}
