/**
 * Carga diferida de GA4 (plan, F7.1): gtag.js se pide recién en la primera
 * interacción (toque, tecla, scroll), así no compite con la carga inicial ni resta
 * puntos de Lighthouse. Las dependencias se inyectan para poder probarlo sin navegador.
 */
import { setGaState } from './analytics';

export const GA4_ID_PATTERN = /^G-[A-Z0-9]{4,12}$/;
export const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

export function isValidGa4Id(id: unknown): id is string {
  return typeof id === 'string' && GA4_ID_PATTERN.test(id);
}

export function ga4ScriptUrl(id: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
}

/** Ejecuta `callback` una sola vez, en la primera interacción. Devuelve una función para cancelar. */
export function onFirstInteraction(target: EventTarget, callback: () => void): () => void {
  const cleanup = () => {
    for (const type of INTERACTION_EVENTS) target.removeEventListener(type, handler);
  };
  function handler() {
    cleanup();
    callback();
  }
  for (const type of INTERACTION_EVENTS) target.addEventListener(type, handler, { passive: true });
  return cleanup;
}

interface LoaderEnv {
  document: {
    createElement(tag: 'script'): HTMLScriptElement;
    head: { appendChild(node: Node): unknown };
  };
  gtag: (...args: unknown[]) => void;
}

/** Configura GA4 sin señales de Google ni personalización de anuncios y agrega gtag.js. */
export function loadGa4(id: string, env: LoaderEnv): HTMLScriptElement {
  setGaState('loading');
  env.gtag('js', new Date());
  env.gtag('config', id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = env.document.createElement('script');
  script.async = true;
  script.src = ga4ScriptUrl(id);
  script.addEventListener('load', () => setGaState('ready'));
  script.addEventListener('error', () => setGaState('off'));
  env.document.head.appendChild(script);
  return script;
}
