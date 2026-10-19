/** Textos del cotizador. La lógica devuelve códigos; aquí está el texto. */
import type { QuoteError, VehicleType } from '@/lib/quote-validation';

export const QUOTE_ERRORS: Record<QuoteError, string> = {
  'plate-empty': 'Escribe la placa de tu vehículo.',
  'plate-short': 'La placa debe tener al menos 5 caracteres.',
  vehicle: 'Elige si es moto o carro.',
  'plate-unusual':
    'Revisa la placa: normalmente es ABC123 (carro) o ABC12D (moto). Si está bien, pulsa de nuevo «Cotizar por WhatsApp».',
};

export const PLATE_HINTS: Record<VehicleType | 'none', string> = {
  none: 'Carro: ABC123 · Moto: ABC12D',
  moto: '3 letras, 2 números y 1 letra. Ejemplo: ABC12D.',
  carro: '3 letras y 3 números. Ejemplo: ABC123.',
};

export const PLATE_PLACEHOLDERS: Record<VehicleType | 'none', string> = {
  none: 'ABC123',
  moto: 'ABC12D',
  carro: 'ABC123',
};
