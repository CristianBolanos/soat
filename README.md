# SOAT YA

Landing de conversión para cotizar y comprar el **SOAT de moto o carro en Colombia por WhatsApp**. Sitio 100 % estático hecho con Astro, TypeScript estricto y Tailwind. Se publica en dos lugares, gratis y desde el mismo repositorio:

- **Cloudflare Pages** (dirección principal): https://soatya.pages.dev
- **GitHub Pages** (la dirección de siempre): https://cristianbolanos.github.io/soat/

## Requisitos

- Node.js 22.22 o superior (la versión exacta está en `.node-version`)
- pnpm 10

## Comandos

| Comando                             | Qué hace                                                              |
| ----------------------------------- | --------------------------------------------------------------------- |
| `pnpm install`                      | Instala las dependencias                                              |
| `pnpm dev`                          | Servidor de desarrollo en http://localhost:4321                       |
| `pnpm build`                        | Genera el sitio estático en `dist/`                                   |
| `pnpm preview`                      | Sirve `dist/` en local                                                |
| `pnpm lint`                         | ESLint (accesibilidad y límites de código limpio)                     |
| `pnpm format` / `pnpm format:check` | Prettier                                                              |
| `pnpm check`                        | Revisión de tipos (`astro check`)                                     |
| `pnpm test`                         | Pruebas unitarias (Vitest)                                            |
| `pnpm test:build`                   | Pruebas sobre `dist/` (SEO, enlaces, seguridad, contenido, base)      |
| `pnpm validate:html`                | html-validate y Nu HTML Checker del W3C                               |
| `pnpm test:e2e`                     | Playwright y axe en 5 perfiles (Chromium, Firefox, WebKit, móviles)   |
| `pnpm lhci`                         | Lighthouse CI (meta: 100 en las 4 categorías)                         |
| `pnpm test:release`                 | Puerta de lanzamiento: datos legales completos y fecha de la política |
| `pnpm verify`                       | Todo lo anterior salvo E2E y Lighthouse                               |

El CI de GitHub (`.github/workflows/ci.yml`) corre todo esto en cada pull request y en `main`. Para probar la versión de GitHub Pages en local: `DEPLOY_BASE=soat pnpm build && DEPLOY_BASE=soat pnpm preview` y abrir http://localhost:4321/soat/.

## Estructura

```
src/
  config/site.ts      Datos del negocio: contacto, horario, enlaces y datos legales
  data/               Contenido: faq.ts, landing.ts, payment.ts, quote-messages.ts
  lib/                Lógica pura y probada (validación, WhatsApp, analítica, JSON-LD)
  scripts/            JavaScript del navegador (cotizador, tema, barra móvil, medición)
  layouts/            Layout base (SEO, tema, fuentes)
  components/         Componentes de presentación
  pages/              Rutas: portada, política de datos, términos, 404 y robots.txt
  styles/global.css   Tailwind y tokens de diseño (claro y oscuro)
public/               Íconos, imagen para compartir, manifest y `_headers` (seguridad)
tests/                unit, build, e2e y release
scripts/              Validación del HTML con el Nu Checker
.github/workflows/    ci.yml (calidad) y pages.yml (GitHub Pages)
```

## Cómo cambiar lo habitual

- **Teléfono, correo, horario, Facebook o datos del responsable:** solo en `src/config/site.ts`.
- **Preguntas frecuentes:** `src/data/faq.ts` (alimenta también los datos estructurados de Google).
- **Textos de las secciones, medios de pago y mensajes del chat:** `src/data/landing.ts`, `src/data/payment.ts` y `src/data/quote-messages.ts`.
- **Dirección pública:** `SITE_URL` en `astro.config.mjs` (canonical, sitemap y robots la heredan).
- **Reglas del sitio:** no se publican precios ni nombres de aseguradoras (hay pruebas que fallan si aparecen), y la única vía de contacto es WhatsApp.

## Despliegue

Cada push a `main` publica en los dos lugares.

### GitHub Pages

Lo hace `.github/workflows/pages.yml`: compila con `DEPLOY_BASE=soat` (el sitio vive bajo `/soat/`) y publica `dist/`. Requiere **Settings → Pages → Source: GitHub Actions**. Una prueba (`tests/build/base-path.test.ts`) comprueba que todos los enlaces, imágenes, fuentes e íconos lleven `/soat`. Todo enlace o archivo propio que empiece con «/» debe pasar por `withBase()` (`src/lib/paths.ts`). El canonical, Open Graph y JSON-LD apuntan siempre a la dirección principal (Cloudflare), para que Google vea una sola. GitHub Pages ignora `public/_headers`, así que ahí solo rige la CSP de la etiqueta `<meta>`.

### Cloudflare Pages

Proyecto `soatya`, conectado a este repositorio (sin `DEPLOY_BASE`, el sitio queda en la raíz):

- Rama de producción: `main` (cada push publica). Las demás ramas generan una vista previa con `noindex`.
- Configuración del proyecto: comando de build `pnpm build`, directorio de salida `dist` (si quedan vacíos, Cloudflare publica el repositorio sin compilar y todo da 404) y variable `PNPM_VERSION` = `10.17.1`. No definas `NODE_VERSION`: Cloudflare toma `.node-version`.
- Las cabeceras de seguridad (CSP, HSTS, etc.) salen de `public/_headers` y de la CSP con hashes que genera Astro.
- **Analítica opcional:** define `PUBLIC_GA4_ID` (`G-XXXXXXX`) en Cloudflare, en Producción y Vista previa. Sin esa variable no se carga nada de Google. Las visitas también se pueden contar con Cloudflare Web Analytics (sin cookies).
- **Cada enero:** el año («SOAT 2027») se calcula al compilar, así que hay que reconstruir el sitio. Crea un _Deploy hook_ en Cloudflare (Settings → Builds) y ábrelo el 1 de enero, o pulsa _Retry deployment_ en el último despliegue.
- **Volver atrás:** en Cloudflare, Deployments → elige el despliegue anterior → _Rollback_.
- **Search Console:** agrega `https://soatya.pages.dev/` con la etiqueta HTML y envía `sitemap-index.xml`.

## Seguridad

Sitio estático: sin servidor, base de datos ni formularios que guarden datos. El riesgo real es el robo de cuentas: activa la verificación en dos pasos (con app de autenticación, no SMS) en GitHub, Cloudflare, Google, Facebook y WhatsApp Business, y guarda los códigos de respaldo.

## Créditos

Logo, íconos de app e ilustración son propios. Letras: Plus Jakarta Sans y Barlow Semi Condensed (SIL OFL 1.1, vía Fontsource). Íconos de interfaz: Lucide (ISC) y Simple Icons (CC0; el logo de WhatsApp es marca de Meta y solo indica el canal de contacto).
