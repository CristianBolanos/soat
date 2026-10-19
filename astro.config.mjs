// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL pública provisional (Cloudflare Pages, plan gratuito). Cuando exista el
// dominio propio, se cambia solo aquí: canonical, sitemap, robots y OG lo heredan.
const SITE_URL = 'https://soat-ya.pages.dev';

// GA4 se activa definiendo PUBLIC_GA4_ID (p. ej. en Cloudflare Pages). Sin ID no se
// carga nada de Google y sus dominios no entran a la CSP (mínimo privilegio).
const GA4_ID = process.env['PUBLIC_GA4_ID'] ?? '';
const GA4_ENABLED = /^G-[A-Z0-9]{4,12}$/.test(GA4_ID);
const GA4 = GA4_ENABLED
  ? {
      script: ['https://www.googletagmanager.com'],
      connect: [
        'https://*.google-analytics.com',
        'https://*.analytics.google.com',
        'https://*.googletagmanager.com',
      ],
      img: ['https://*.google-analytics.com', 'https://*.googletagmanager.com'],
    }
  : { script: [], connect: [], img: [] };

// Cloudflare Web Analytics (sin cookies): Cloudflare inyecta su beacon si se activa en el panel.
const CLOUDFLARE = {
  script: ['https://static.cloudflareinsights.com'],
  connect: ['https://cloudflareinsights.com'],
};

/** Lista de fuentes CSP: 'self' más las listas recibidas. @param {...string[]} lists */
const sources = (...lists) => ["'self'", ...lists.flat()].join(' ');

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
  env: {
    schema: {
      PUBLIC_GA4_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
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
        `img-src ${sources(['data:'], GA4.img)}`,
        "font-src 'self'",
        `connect-src ${sources(CLOUDFLARE.connect, GA4.connect)}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://wa.me https://api.whatsapp.com",
        // Sin 'upgrade-insecure-requests': todo es del mismo origen HTTPS (y HSTS en
        // public/_headers); esa directiva rompe WebKit al probar en http://localhost.
      ],
      scriptDirective: {
        resources: ["'self'", ...CLOUDFLARE.script, ...GA4.script],
      },
    },
  },
  // Sin resaltado de código: el sitio no lo usa y Shiki requiere estilos en línea (incompatibles con la CSP).
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/dev/'),
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
