/**
 * Medición declarativa (docs/medicion.md): cualquier elemento con
 * `data-track="evento"` y `data-track-<parametro>="valor"` envía su evento al
 * hacer clic. También mide qué preguntas del FAQ se abren.
 */
import { isEventName, track } from '@/lib/analytics';

function paramsFrom(element: HTMLElement): Record<string, string> {
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(element.dataset)) {
    if (key.startsWith('track') && key !== 'track' && value) {
      params[key.slice('track'.length).toLowerCase()] = value;
    }
  }
  return params;
}

document.addEventListener('click', (event) => {
  const target =
    event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track]') : null;
  const name = target?.dataset['track'];
  if (target && isEventName(name)) track(name, paramsFrom(target));
});

// `toggle` no burbujea: se escucha en fase de captura.
document.addEventListener(
  'toggle',
  (event) => {
    const details = event.target;
    if (!(details instanceof HTMLDetailsElement) || !details.open) return;
    const index = Number(details.dataset['faqIndex']);
    if (Number.isInteger(index)) track('faq_open', { pregunta: index });
  },
  true,
);
