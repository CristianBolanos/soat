/**
 * Activa GA4 solo si se definió PUBLIC_GA4_ID al compilar (docs/medicion.md).
 * Sin ID no se descarga nada de Google: la cola de eventos queda en memoria.
 */
import { PUBLIC_GA4_ID } from 'astro:env/client';
import { ensureGtag } from '@/lib/analytics';
import { isValidGa4Id, loadGa4, onFirstInteraction } from '@/lib/analytics-loader';

const id = PUBLIC_GA4_ID;
if (isValidGa4Id(id)) {
  onFirstInteraction(window, () => loadGa4(id, { document, gtag: ensureGtag() }));
}
