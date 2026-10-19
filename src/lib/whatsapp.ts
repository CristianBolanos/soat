/**
 * Enlaces y mensajes de WhatsApp (docs/copy.md, «Mensajes de WhatsApp»).
 * Funciones puras: no tocan el DOM y se prueban en tests/unit/whatsapp.test.ts.
 */
import type { VehicleType } from './quote-validation';

export type LeadOrigin = 'web' | 'ads';

export const MESSAGES = {
  generic: 'Hola, quiero cotizar mi SOAT.',
  otherVehicle: 'Hola, quiero cotizar el SOAT de otro tipo de vehículo (taxi, camión, bus u otro).',
} as const;

/** Mensaje del cotizador con el tipo y la placa (sin cédula ni teléfono). */
export function quoteMessage(vehicle: VehicleType, plate: string): string {
  return `Hola, quiero el SOAT de mi ${vehicle} de placa ${plate}. ¿Me ayudas con el valor?`;
}

/** Agrega la etiqueta de origen para que el asesor sepa de dónde viene el chat. */
export function withOrigin(message: string, origin: LeadOrigin): string {
  return `${message} [${origin}]`;
}

/** `[ads]` si la visita viene de pauta (gclid, fbclid o utm_medium=cpc); si no, `[web]`. */
export function originFromSearch(search: string): LeadOrigin {
  const params = new URLSearchParams(search);
  const fromAds = params.has('gclid') || params.has('fbclid') || params.get('utm_medium') === 'cpc';
  return fromAds ? 'ads' : 'web';
}

/** URL de wa.me con el mensaje codificado. `number` en formato internacional, solo dígitos. */
export function whatsappUrl(number: string, message: string): string {
  if (!/^\d{8,15}$/.test(number)) throw new Error(`Número de WhatsApp inválido: ${number}`);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
