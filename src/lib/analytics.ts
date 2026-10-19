/**
 * Analítica sin datos personales (docs/medicion.md).
 * - Solo eventos y parámetros de la lista permitida; valores en minúsculas tipo «slug».
 *   Así una placa (ABC12D) o un teléfono nunca llegan a la analítica (políticas de GA4, Ley 1581).
 * - Encola con la firma de gtag; GA4 se carga más tarde (F7) y procesa la cola.
 * - Nunca lanza errores: la analítica jamás debe bloquear la conversión.
 */
export const EVENTS = [
  'quote_start',
  'vehicle_select',
  'generate_lead',
  'whatsapp_click',
  'phone_click',
  'cta_click',
  'runt_click',
  'faq_open',
  'theme_change',
] as const;
export type EventName = (typeof EVENTS)[number];

const ALLOWED_PARAMS = ['tipo', 'origen', 'ubicacion', 'pregunta', 'tema'] as const;
type ParamName = (typeof ALLOWED_PARAMS)[number];
export type EventParams = Partial<Record<ParamName, string | number>>;

const SLUG = /^[a-z0-9_-]{1,40}$/;

export function isEventName(value: unknown): value is EventName {
  return typeof value === 'string' && (EVENTS as readonly string[]).includes(value);
}

/** Deja solo parámetros permitidos con valores seguros (sin mayúsculas ni datos personales). */
export function sanitizeParams(params: Record<string, unknown>): EventParams {
  const clean: Record<string, string | number> = {};
  for (const name of ALLOWED_PARAMS) {
    const value = params[name];
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < 100) {
      clean[name] = value;
    } else if (typeof value === 'string' && SLUG.test(value)) {
      clean[name] = value;
    }
  }
  return clean;
}

/** Eventos que llevan a otra página: se envían por beacon para no perderlos. */
const OUTBOUND: ReadonlySet<EventName> = new Set([
  'generate_lead',
  'whatsapp_click',
  'phone_click',
  'runt_click',
]);

export function eventPayload(name: EventName, params: Record<string, unknown> = {}) {
  const clean = sanitizeParams(params);
  return OUTBOUND.has(name) ? { ...clean, transport_type: 'beacon' } : clean;
}

type Gtag = (...args: unknown[]) => void;
interface AnalyticsWindow {
  dataLayer?: unknown[];
  gtag?: Gtag;
}

export function track(name: EventName, params: Record<string, unknown> = {}): void {
  try {
    const w = window as unknown as AnalyticsWindow;
    w.dataLayer = w.dataLayer ?? [];
    w.gtag =
      w.gtag ??
      function gtag() {
        // gtag.js espera el objeto `arguments` en la cola.
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer?.push(arguments);
      };
    w.gtag('event', name, eventPayload(name, params));
  } catch {
    // La analítica nunca interrumpe al visitante.
  }
}
