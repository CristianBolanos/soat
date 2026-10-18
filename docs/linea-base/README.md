# Línea base del sitio actual (F0.1)

Medición del sitio que se va a reemplazar, para comprobar la mejora y detectar regresiones (plan, F0.1 y F9.4).

- **URL medida:** https://cristianbolanos.github.io/soat/
- **Fecha:** 18 de octubre de 2026
- **Herramienta:** Lighthouse 12.6.1 en local (Chrome headless). La API anónima de PageSpeed Insights tenía la cuota diaria agotada; se usa el mismo motor.
- **Móvil:** perfil por defecto de Lighthouse (Moto G Power con 4G lenta simulada), 3 corridas, se reporta la mediana.
- **Escritorio:** preset `desktop`, 1 corrida.

## Puntuaciones

| Perfil | Rendimiento | Accesibilidad | Buenas prácticas | SEO | FCP | LCP | TBT | CLS | Peso |
|---|---|---|---|---|---|---|---|---|---|
| Móvil (mediana de 69, 71 y 89) | **71** | 96 | 100 | 100 | 4,1 s | 4,7 s | 0 ms | 0,064 | 613 KiB |
| Escritorio | 94 | 96 | 100 | 100 | 1,1 s | 1,1 s | 0 ms | 0,006 | 613 KiB |

**Meta del sitio nuevo (plan, R38):** 100 en las cuatro categorías, en la mediana de 3 corridas en móvil. LCP de 2,0 s o menos, CLS de 0,05 o menos y peso de 250 KB o menos.

## Auditorías que fallan hoy

- **Rendimiento:** recursos que bloquean el render (Google Fonts y Font Awesome desde CDN), CSS sin minificar y sin usar, imágenes sin tamaño responsive, caché corta, árbol de dependencias de red largo y DOM grande.
- **Accesibilidad:** `color-contrast` (botones de WhatsApp y naranja) y `label-content-name-mismatch`.
- **CLS:** 0,064 en móvil, por imágenes sin `width`/`height` y por la carga de fuentes.

## Medidas de la página

| Ancho | Alto total | Posición del cotizador |
|---|---|---|
| 360 px | 14.344 px | y = 765 px (bajo el pliegue de 740 px) |
| 768 px | 11.954 px | y = 520 px |
| 1440 px | 6.753 px | y = 192 px |

## Archivos

- `lighthouse-movil-mediana.report.json`: corrida mediana en móvil. Se abre en https://googlechrome.github.io/lighthouse/viewer/.
- `lighthouse-escritorio.report.html`: informe de escritorio.
- `*-pliegue.png`: lo que se ve al abrir la página en 360, 768 y 1440 px.
- `*-completa.jpg`: la página completa en cada ancho.
