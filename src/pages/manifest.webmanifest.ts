/**
 * Manifest de la web app, generado para que `start_url` y los íconos lleven la base de
 * despliegue (`/` en Cloudflare, `/soat/` en GitHub Pages).
 */
import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { withBase } from '@/lib/paths';

export const GET: APIRoute = () => {
  const manifest = {
    name: `${site.name}: tu SOAT de moto o carro por WhatsApp`,
    short_name: site.name,
    description: 'Cotiza y compra tu SOAT de moto o carro por WhatsApp.',
    lang: site.locale,
    start_url: withBase('/'),
    display: 'browser',
    background_color: '#FFFFFF',
    theme_color: '#0B1F3A',
    icons: [
      { src: withBase('/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: withBase('/icon-512.png'), sizes: '512x512', type: 'image/png' },
      {
        src: withBase('/icon-maskable-512.png'),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
