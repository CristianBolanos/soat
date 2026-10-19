# SOAT YA

Landing de conversión para cotizar y comprar el **SOAT de moto o carro en Colombia por WhatsApp**. Es un sitio 100 % estático, hecho con Astro y alojado gratis en Cloudflare Pages.

> **Estado:** landing completa con SEO técnico, analítica GA4 lista para activar y cabeceras de seguridad (F0–F8). Lighthouse: 100 en las cuatro categorías. Faltan QA en dispositivos reales (F9), revisión final (G3) y lanzamiento, que solo espera fijar la fecha de vigencia de la política al publicar. El sitio anterior está en `legacy/`; las decisiones están en `docs/decisiones.md`.

## Requisitos

- Node.js 22 o superior (ver `.node-version`)
- pnpm 10 o superior

## Comandos

| Comando                             | Qué hace                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `pnpm install`                      | Instala las dependencias                                                     |
| `pnpm dev`                          | Servidor de desarrollo en http://localhost:4321                              |
| `pnpm build`                        | Genera el sitio estático en `dist/`                                          |
| `pnpm preview`                      | Sirve `dist/` en local                                                       |
| `pnpm lint`                         | ESLint (incluye las reglas de accesibilidad y de código limpio)              |
| `pnpm format` / `pnpm format:check` | Prettier                                                                     |
| `pnpm check`                        | Revisión de tipos (`astro check`)                                            |
| `pnpm test`                         | Pruebas unitarias (Vitest)                                                   |
| `pnpm test:build`                   | Pruebas de integración sobre `dist/`                                         |
| `pnpm validate:html`                | html-validate y el Nu HTML Checker del W3C                                   |
| `pnpm test:release`                 | Puerta de lanzamiento: falla si quedan datos «[PENDIENTE…]» en el sitio      |
| `pnpm test:e2e`                     | Playwright más axe (5 perfiles de navegador)                                 |
| `pnpm lhci`                         | Lighthouse CI (meta: 100 en las 4 categorías)                                |
| `pnpm brand`                        | Regenera logo, favicons, imagen OG e ilustración del hero (`scripts/brand/`) |
| `pnpm verify`                       | Todo lo anterior salvo E2E y Lighthouse                                      |

## Estructura

```
src/
  config/site.ts      Datos del negocio (contacto, horario, red aliada)
  data/               Datos de contenido (FAQ)
  lib/                Lógica pura y probada (validación, WhatsApp, analítica, JSON-LD)
  layouts/            Layout base (SEO, tema, fuentes)
  components/         Componentes de presentación
  pages/              Rutas del sitio
  styles/global.css   Tailwind y tokens de diseño (claro y oscuro)
tests/
  unit/  build/  e2e/
docs/                 Decisiones, marca, copy, SEO, medición, soporte y despliegue
```

## Documentación

- `docs/decisiones.md`: registro de decisiones
- `docs/marca.md`: guía de marca y estudio de mercado
- `docs/copy.md`: todos los textos del sitio
- `docs/seo-palabras-clave.md`: mapa de palabras clave
- `docs/cro-embudo.md`: CTA y embudo
- `docs/medicion.md`: plan de analítica
- `docs/tarifas-2026.md`: investigación de tarifas (referencia interna, no se publica)
- `docs/paridad.md`: qué pasa con cada función del sitio anterior
- `docs/insumos-cliente.md`: datos pendientes del cliente
- `docs/soporte.md`: navegadores soportados
- `docs/despliegue.md`: Cloudflare Pages paso a paso, lanzamiento y reversa
- `docs/qa-checklist.md`: pruebas en celulares y navegadores reales (F9)
- `docs/revision-final/`: revisión final por roles con evidencias y capturas (F10, compuerta G3)
- `docs/seguridad.md`: controles activos, controles que no aplican y seguridad de las cuentas
- `docs/linea-base/`: medición del sitio anterior
- `docs/wireframes/`: wireframes de baja fidelidad (compuerta G1)
- `docs/creditos.md`: origen y licencia de cada recurso visual
- `docs/marca/`: logo e ilustración en vector
- `docs/diseno/`: capturas del diseño (compuerta G2)

## Mantenimiento

- **Precios:** el sitio no publica precios (decisión D5), así que no hay que actualizar tarifas cada año.
- **Año:** `{año}` se calcula al compilar. Basta con reconstruir el sitio en enero (o activar el _deploy hook_ opcional, ver `docs/decisiones.md`, T10).
- **Dependencias:** Dependabot abre PR semanales; el CI valida cada una antes del merge.
