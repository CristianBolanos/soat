// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL pública provisional (Cloudflare Pages, plan gratuito). Cuando exista el
// dominio propio, se cambia solo aquí: canonical, sitemap y OG lo heredan.
const SITE_URL = 'https://soat-ya.pages.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  // Astro 7 cambió el valor por defecto a 'jsx', que elimina espacios entre
  // elementos en línea; se mantiene el comportamiento clásico.
  compressHTML: true,
  build: {
    // /terminos.html → Cloudflare Pages lo sirve como /terminos (URL limpia).
    format: 'file',
    // Una sola página ligera: el CSS va en línea y no bloquea el render.
    inlineStylesheets: 'always',
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            // Fuente variable auto-alojada (subconjunto latino: incluye tildes, ñ, ¿ y ¡).
            src: [
              '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2',
            ],
            weight: '200 800',
            style: 'normal',
          },
        ],
      },
    },
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://wa.me https://api.whatsapp.com",
        // Sin 'upgrade-insecure-requests': todo es del mismo origen HTTPS (y HSTS en
        // public/_headers); esa directiva rompe WebKit al probar en http://localhost.
      ],
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
