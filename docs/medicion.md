# Plan de medición (F1.6)

## Principios

- **Ningún dato personal en la analítica:** ni placa, ni teléfono, ni documento (políticas de GA4 y Ley 1581).
- **La analítica nunca bloquea la conversión:** si GA4 no carga (Brave, bloqueadores, mala conexión), el CTA funciona igual.
- **Rendimiento:** GA4 se carga después de la primera interacción (`pointerdown`, `keydown`, `scroll` o `touchstart`), para mantener Lighthouse en 100. Las visitas se cuentan con **Cloudflare Web Analytics**, que no usa cookies y no depende de esa interacción.

## Herramientas

| Herramienta              | Para qué                                 | Estado                                                                       |
| ------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| Cloudflare Web Analytics | Visitas, páginas y países                | Se activa al conectar Cloudflare Pages                                       |
| Google Analytics 4       | Eventos y conversiones                   | Falta el ID de medición (`G-XXXX`), que se configura en `src/config/site.ts` |
| Google Ads               | Importar `generate_lead` como conversión | [Opcional] si hay pauta                                                      |
| Píxel de Meta            | Conversiones de Meta Ads                 | **Apagado por defecto** (bandera en la configuración); solo si hay pauta     |

## Eventos

| Evento           | Se dispara cuando                                                | Parámetros (valores permitidos)                                            | ¿Conversión?          |
| ---------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------- |
| `quote_start`    | Primer foco o clic dentro del cotizador                          | —                                                                          | No                    |
| `vehicle_select` | Elige moto o carro                                               | `tipo`: `moto` o `carro`                                                   | No                    |
| `generate_lead`  | Pulsa «Cotizar por WhatsApp» con placa válida y se abre WhatsApp | `tipo`: `moto` o `carro`; `origen`: `web` o `ads`                          | **Sí (evento clave)** |
| `whatsapp_click` | Pulsa cualquier otro enlace de WhatsApp                          | `ubicacion`: `header`, `otro_vehiculo`, `barra_movil`, `cta_final` o `pie` | Secundaria            |
| `phone_click`    | Pulsa un enlace `tel:`                                           | `ubicacion`                                                                | Secundaria            |
| `cta_click`      | Pulsa «Empezar ahora» o «Consultar el valor de mi moto/carro»    | `ubicacion`: `como_funciona` o `cuanto_cuesta`; `tipo` cuando aplica       | No                    |
| `runt_click`     | Pulsa «Verificar mi SOAT en el RUNT»                             | —                                                                          | No                    |
| `faq_open`       | Abre una pregunta                                                | `pregunta`: número del 1 al 8                                              | No                    |
| `theme_change`   | Cambia el tema                                                   | `tema`: `claro` u `oscuro`                                                 | No                    |

Los eventos que llevan a otra página (WhatsApp, `tel:`, RUNT) se envían con `transport_type: 'beacon'`, para no perderlos al salir.

## Convención UTM (enlaces de campañas)

| Parámetro      | Valores                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `utm_source`   | `facebook`, `instagram`, `google`, `whatsapp`, `tiktok`, `qr`           |
| `utm_medium`   | `cpc` (pauta), `social` (orgánico), `referral`, `qr`, `estado-whatsapp` |
| `utm_campaign` | `soat-{moto/carro}-{año}`, por ejemplo `soat-moto-2026`                 |
| `utm_content`  | Variante del anuncio, por ejemplo `video-a` o `imagen-precio`           |

**Ejemplo:** `https://soat-ya.pages.dev/?utm_source=facebook&utm_medium=cpc&utm_campaign=soat-moto-2026&utm_content=imagen-precio`

Con `gclid`, `fbclid` o `utm_medium=cpc`, el mensaje de WhatsApp lleva la etiqueta `[ads]`; en los demás casos lleva `[web]`.

## Privacidad

- GA4 sin señales de Google ni personalización de anuncios mientras no haya pauta.
- La política de datos explica la analítica y las cookies (F7.3).
- **[Opcional]** Banner de consentimiento con Consent Mode v2 si se activa el remarketing.

## Verificación

- Revisar los eventos en tiempo real en GA4 DebugView, en Chrome y en el celular.
- Prueba E2E: el `dataLayer` recibe `generate_lead` sin la placa.
- Prueba E2E: con `googletagmanager.com` bloqueado, el CTA sigue abriendo WhatsApp.
