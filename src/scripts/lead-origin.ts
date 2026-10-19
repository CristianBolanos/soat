/**
 * Si la visita viene de pauta (gclid, fbclid o utm_medium=cpc), los enlaces de
 * WhatsApp llevan la etiqueta [ads] en vez de [web], para que el asesor sepa de
 * dónde viene cada chat. No envía nada a ningún servidor.
 */
import { originFromSearch } from '@/lib/whatsapp';

if (originFromSearch(window.location.search) === 'ads') {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]')) {
    const url = new URL(link.href);
    const text = url.searchParams.get('text');
    if (text) {
      url.searchParams.set('text', text.replace('[web]', '[ads]'));
      link.href = url.toString();
    }
  }
  for (const input of document.querySelectorAll<HTMLInputElement>(
    'form[data-quote-form] input[name="text"]',
  )) {
    input.value = input.value.replace('[web]', '[ads]');
  }
}
