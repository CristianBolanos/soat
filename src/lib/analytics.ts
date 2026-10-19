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

/** Estado de GA4: 'off' sin ID configurado, 'loading' mientras carga gtag.js, 'ready' al cargar. */
export type GaState = 'off' | 'loading' | 'ready';
let gaState: GaState = 'off';

export function setGaState(state: GaState): void {
  gaState = state;
}

export function getGaState(): GaState {
  return gaState;
}

/** Crea (una sola vez) la cola `dataLayer` y la función `gtag` que gtag.js procesará al cargar. */
export function ensureGtag(): Gtag {
  const w = window as unknown as AnalyticsWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.gtag =
    w.gtag ??
    function gtag() {
      // gtag.js espera el objeto `arguments` en la cola.
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer?.push(arguments);
    };
  return w.gtag;
}

export function track(
  name: EventName,
  params: Record<string, unknown> = {},
  onSent?: () => void,
): void {
  try {
    const callback = onSent ? { event_callback: onSent, event_timeout: 300 } : {};
    ensureGtag()('event', name, { ...eventPayload(name, params), ...callback });
  } catch {
    // La analítica nunca interrumpe al visitante.
  }
}

interface NavigateOptions {
  navigate?: (url: string) => void;
  timeoutMs?: number;
}

/**
 * Registra un evento de salida y navega. Con GA4 activo espera la confirmación de
 * envío como máximo `timeoutMs` (así la conversión no se pierde); sin GA4 navega ya.
 */
export function trackThenNavigate(
  name: EventName,
  params: Record<string, unknown>,
  url: string,
  { navigate = (target) => window.location.assign(target), timeoutMs = 300 }: NavigateOptions = {},
): void {
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    navigate(url);
  };
  if (gaState === 'off') {
    track(name, params);
    go();
    return;
  }
  track(name, params, go);
  setTimeout(go, timeoutMs);
}
