# Revisión final multidisciplinaria (F10): compuerta G3

- **Fecha:** 18 de octubre de 2026
- **Qué se revisó:** el sitio completo en local (rama `astro-migration`), con el texto, el diseño y el código finales.
- **Resultado:** **listo para aprobar G3.** Los «No» que aparecieron se corrigieron en esta misma revisión (requisito R108). Quedan pendientes que necesitan la URL pública o a personas reales: se hacen durante el despliegue, **antes** de pasar a producción.

## Cómo leer la lista

| Marca | Significado                                                             |
| ----- | ----------------------------------------------------------------------- |
| ✅    | Cumple, con evidencia local.                                            |
| 🔧    | Era «No» y se corrigió en esta revisión.                                |
| ⏳    | Necesita la URL pública: se hace en la vista previa, antes de publicar. |
| 👤    | Depende de ti: personas reales o tu aprobación.                         |

## Resumen por rol

| Rol           | Pregunta                                            | Resultado                                                  |
| ------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| UX/UI senior  | ¿Se ve profesional y moderna?                       | 🔧 → ✅                                                    |
| Frontend      | ¿La arquitectura es limpia, eficiente y mantenible? | ✅                                                         |
| SEO           | ¿Google entiende el negocio?                        | ✅ · ⏳ prueba de resultados enriquecidos                  |
| CRO           | ¿El usuario entiende el sitio con facilidad?        | ✅ revisión experta · 👤 prueba de 5 segundos              |
| Cliente       | ¿Transmite confianza y dan ganas de comprar?        | 👤 tu aprobación                                           |
| UX            | ¿La experiencia es intuitiva?                       | ✅ revisión experta · 👤 prueba con 3 personas             |
| UI            | ¿La interfaz es coherente?                          | 🔧 → ✅                                                    |
| Copywriter    | ¿El contenido comunica y persuade?                  | 🔧 → ✅                                                    |
| Accesibilidad | ¿Lo puede usar cualquier persona?                   | ✅ · ⏳ WAVE · 👤 lector de pantalla (opcional)            |
| Rendimiento   | ¿Carga rápido?                                      | ✅ · ⏳ PageSpeed y WebPageTest                            |
| Seguridad     | ¿Hay riesgos evidentes?                             | ✅ · ⏳ securityheaders.com · 👤 verificación en dos pasos |
| QA            | ¿Hay errores funcionales?                           | ✅ · 👤 celulares reales                                   |
| Producto      | ¿Cumple el objetivo comercial?                      | ✅ · 👤 chat real · ⏳ GA4 (opcional)                      |

## Antes y después

| Medida (móvil)                                                   | Sitio viejo                  | Sitio nuevo                                      |
| ---------------------------------------------------------------- | ---------------------------- | ------------------------------------------------ |
| Lighthouse: rendimiento / accesibilidad / buenas prácticas / SEO | 71 / 96 / 100 / 100          | **100 / 100 / 100 / 100**                        |
| LCP (carga del contenido principal)                              | 4,7 s                        | 1,5 s                                            |
| Peso de la página                                                | 613 KiB                      | 57,6 KiB                                         |
| Alto de la página en 360 px                                      | 14.344 px                    | 6.181 px                                         |
| Cotizador en 360×740                                             | Bajo el pliegue (y = 765 px) | Completo en la primera pantalla                  |
| Pasos para pedir la cotización                                   | 4 pasos con cédula           | Placa y un botón (el tipo se deduce de la placa) |

## Detalle y evidencia por rol

### UX/UI senior: 🔧 → ✅

- Capturas en esta carpeta: 360, 768 y 1440 px, en tema claro y oscuro, más la primera pantalla en 360 px.
- El diseño visual se aprobó en G2.
- **Se corrigieron dos defectos:**
  - En celulares de 360 a 390 px, la barra fija y los botones «Consultar el valor de mi moto / carro» partían el texto en dos líneas pegadas al borde. Ahora caben en una línea (T26).
  - La lista de beneficios dentro del cotizador repetía la franja que va justo debajo. Ahora queda solo el horario (T27).

### Frontend: ✅

- ESLint y `astro check`: 0 errores y 0 advertencias; Prettier sin cambios pendientes.
- Los límites de código limpio están activos en el CI: 50 líneas por función, 250 por archivo y complejidad máxima de 10. El archivo más largo tiene 170 líneas.
- Los datos están separados de la presentación y cada dato tiene una sola fuente: `site.ts` (contacto y datos legales), `faq.ts`, `landing.ts` y `payment.ts`.
- JavaScript total en la página principal: 6,2 KiB (presupuesto: 20 KiB). Sin código pendiente (TODO).

### SEO: ✅ · ⏳

- SEO de Lighthouse: 100 en la página principal, la política y los términos. La 404 da menos a propósito, porque lleva `noindex`.
- El title, la description y el H1 coinciden con el mapa de palabras clave (`docs/seo-palabras-clave.md`).
- Datos estructurados (Organization, WebSite, WebPage y FAQPage) generados desde los datos y validados por las pruebas de build. Ahora incluyen tu página de Facebook (`sameAs`).
- ⏳ La prueba de resultados enriquecidos de Google se corre con la URL de la vista previa. El 100 de SEO en internet se confirma en producción, porque la vista previa lleva `noindex`.

### CRO: ✅ · 👤

- **Revisión experta:**
  - El H1 dice qué se vende (SOAT de moto o carro) y cómo (WhatsApp).
  - El cotizador completo se ve sin bajar en 360×740 (prueba automática).
  - Hay un solo botón principal por pantalla.
  - Para pedir la cotización basta escribir la placa y pulsar el botón, porque el tipo de vehículo se deduce de la placa.
- 👤 **Prueba de 5 segundos:** muestra la primera pantalla en tu celular a 3 a 5 personas durante 5 segundos, quítala y pregunta «¿Qué vende esta página?» y «¿Qué harías para comprar?». Pasa si al menos 4 de 5 responden «SOAT» y «poner la placa» o «escribir por WhatsApp».

### Cliente: 👤

- Elementos de confianza:
  - Valor confirmado antes de pagar.
  - Verificación en el RUNT.
  - Asesor real con horario.
  - Número oficial para los pagos.
  - Política de datos con tus datos.
  - Enlace a tu Facebook.
- Tu aprobación de G3 es la evidencia de este punto.

### UX: ✅ · 👤

- La cotización se completa solo con teclado (escribir la placa y pulsar Enter abre WhatsApp con el mensaje correcto), y las pruebas automáticas la cubren en 5 navegadores y dispositivos.
- 👤 **Tarea con 3 personas:** pide «Cotiza el SOAT de tu moto» sin dar ayuda y mide el tiempo hasta que se abra WhatsApp, sin enviar el mensaje. Pasa si las 3 lo logran en menos de 30 segundos.

### UI: 🔧 → ✅

- Ningún color fuera de los tokens del sistema de diseño. La única excepción es `theme-color`, que debe ir escrito y usa el mismo valor del token de fondo.
- Los valores a medida son solo de maquetación: columnas, zona segura del iPhone y el borde de la placa.
- **Se corrigió:** había textos de 12 px (el aviso del pie, la línea de derechos y el antetítulo) y el plan fija un mínimo de 14 px. Ahora todos están en 14 px (T28).

### Copywriter: 🔧 → ✅

- Se comparó el documento de textos (`docs/copy.md`) con el sitio, y quedaron iguales.
- **Promesas verificadas contigo el 18-oct-2026 (D7):**
  - «Listo hoy»: expides el mismo día.
  - Asesoría sin costo adicional: no cobras nada extra.
  - Póliza en PDF: llega al correo y también la envías por WhatsApp.
- **Se corrigió una frase falsa:** «Nunca te pediremos transferir a cuentas de personas» no era cierta, porque recibes transferencias a tu cuenta. Ahora el sitio avisa que los datos de pago solo se envían desde el número oficial (+57) 316 734 1074, y que si te escriben desde otro número no se debe pagar. Por tu decisión, tu nombre no aparece en los textos de pago. Cambió en las preguntas frecuentes, en «Compra segura» y en los términos. La política de datos ahora incluye el correo y el comprobante de pago.
- **Se corrigió** «p. m..» (punto doble) en los términos, y una prueba nueva impide que vuelva a pasar.
- Las pruebas automáticas confirman que no se nombran aseguradoras ni se publican precios.

### Accesibilidad: ✅ · ⏳ · 👤

- axe: 0 violaciones en los dos temas (pruebas automáticas). Accesibilidad de Lighthouse: 100.
- Recorrido con teclado: 36 paradas de foco, todas con indicador visible y en orden lógico. Funcionan el enlace «Saltar al contenido» y las preguntas frecuentes con teclado.
- Se respeta «reducir movimiento», no hay textos de menos de 14 px y los contrastes cumplen 4,5:1.
- ⏳ WAVE se corre con la URL de la vista previa.
- 👤 **[Opcional]** Prueba con TalkBack o VoiceOver en tu celular (está en `docs/qa-checklist.md`).

### Rendimiento: ✅ · ⏳

- Lighthouse en móvil (mediana de 3 corridas): 100 en rendimiento, accesibilidad, buenas prácticas y SEO en la página principal, la política y los términos. Presupuestos cumplidos: JavaScript 6,2 KiB (máximo 20), peso total 57,6 KiB (máximo 250), LCP 1,5 s (máximo 2,0), CLS 0,029 (máximo 0,05) y TBT 71 ms (máximo 100).
- ⏳ PageSpeed Insights y WebPageTest se corren con la URL de la vista previa.

### Seguridad: ✅ · ⏳ · 👤

- Cabeceras en `public/_headers`: HSTS, `frame-ancestors 'none'`, `nosniff`, Referrer-Policy, Permissions-Policy y COOP. Además, la CSP con hashes va en cada página. Las pruebas de build y E2E comprueban que no haya violaciones de CSP.
- Dependencias de producción (`pnpm audit`): sin vulnerabilidades conocidas.
- El sitio no tiene servidor, base de datos ni formularios que guarden datos (`docs/seguridad.md`).
- ⏳ securityheaders.com (meta: A) con la URL de la vista previa.
- 👤 Verificación en dos pasos en GitHub, Cloudflare, Google, Facebook y WhatsApp Business (lista en `docs/seguridad.md`).

### QA: ✅ · 👤

- Pruebas automáticas:
  - 82 unitarias.
  - 68 de build.
  - 250 E2E y de accesibilidad en Chromium, Firefox, WebKit, Pixel 7 e iPhone 14.
  - Validador W3C y html-validate sin errores.
- Paridad con el sitio viejo: 26 de 26 funciones en OK (`docs/paridad.md`).
- 👤 Lista en celulares y navegadores reales: `docs/qa-checklist.md`. Se puede hacer con la vista previa.

### Producto: ✅ · 👤 · ⏳

- Las pruebas confirman que el mensaje de WhatsApp lleva el tipo de vehículo, la placa y el origen (`[web]` o `[ads]`), y que se registra el evento `generate_lead` sin datos personales.
- 👤 **Prueba real:** desde tu celular personal, cotiza en el sitio y confirma que el chat llega al WhatsApp del negocio con la placa y el tipo.
- ⏳ **[Opcional]** Para ver el evento en GA4 hace falta crear la propiedad y poner `PUBLIC_GA4_ID` (`docs/medicion.md`).
- **Observación:** el año («SOAT 2026») se calcula al construir el sitio, así que cada enero hay que reconstruirlo. Quedó como paso del lanzamiento: un recordatorio anual y un _Deploy hook_ (`docs/despliegue.md`, F11).

## Cambios hechos en esta revisión

1. **Pagos (D7):** se quitó una promesa falsa y ahora se avisa que los datos de pago solo salen del número oficial (sin tu nombre).
2. **Póliza:** ahora se explica que llega al correo y por WhatsApp, y el sitio pide un correo para enviarla.
3. **Botones en una línea desde 360 px**, incluida la barra fija. En la barra, el botón de llamar muestra solo el ícono en celulares (T26).
4. **Sin beneficios repetidos** en el cotizador: queda solo el horario (T27).
5. **Texto mínimo de 14 px** (T28).
6. **Punto doble** en los términos, con una prueba que lo evita.
7. **Marca sin partir:** «SOAT YA» ya no se separa entre dos líneas.
8. **Facebook** enlazado en el pie y en los datos estructurados.

## Pendientes antes de publicar (no impiden aprobar G3)

**Con la vista previa (⏳):** PageSpeed, WebPageTest, securityheaders, W3C CSS, WAVE, resultados enriquecidos de Google y revisión de la consola.

**Tú (👤):**

- La prueba de 5 segundos y la tarea con 3 personas.
- La lista en tus celulares.
- La prueba real del chat.
- La verificación en dos pasos de tus cuentas.

**Al publicar:** fijar la fecha de vigencia de la política, redirigir el sitio viejo, hacer el merge y dar de alta Search Console (`docs/despliegue.md`).

## Archivos de esta carpeta

- `movil-360-*`, `tableta-768-*`, `escritorio-1440-*`: la página completa en cada ancho y tema.
- `movil-360-*-pliegue.png`: lo que se ve al abrir la página en 360×740.
