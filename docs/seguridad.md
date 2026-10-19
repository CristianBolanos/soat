# Seguridad (F8)

El sitio es **100 % estático** (decisión D3): no tiene servidor, base de datos, cuentas de usuario ni formularios que guarden datos. Eso elimina de raíz la mayoría de los riesgos de una web. Lo que queda se cubre así:

## 1. Controles activos

| Riesgo                                         | Control                                                                                                                | Dónde                                                                    | Cómo se verifica                                                      |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| XSS (inyección de scripts)                     | CSP con hashes generada por Astro; sin `'unsafe-inline'`; sin `innerHTML` con datos                                    | `astro.config.mjs` (`security.csp`), regla ESLint `no-restricted-syntax` | Prueba de build (CSP presente), E2E sin violaciones de CSP en consola |
| Clickjacking (sitio dentro de un iframe ajeno) | `frame-ancestors 'none'` y `X-Frame-Options: DENY`                                                                     | `public/_headers`                                                        | Prueba de build de `_headers`; securityheaders.com tras desplegar     |
| Tráfico sin cifrar                             | HTTPS de Cloudflare y HSTS de 1 año                                                                                    | `public/_headers`                                                        | securityheaders.com                                                   |
| Detección errónea del tipo de archivo          | `X-Content-Type-Options: nosniff`                                                                                      | `public/_headers`                                                        | Prueba de build                                                       |
| Fuga de URL a otros sitios                     | `Referrer-Policy: strict-origin-when-cross-origin`                                                                     | `public/_headers`                                                        | Prueba de build                                                       |
| APIs del navegador innecesarias                | `Permissions-Policy` (cámara, micrófono, ubicación, pagos, USB, topics: apagados)                                      | `public/_headers`                                                        | Prueba de build                                                       |
| Ventanas abiertas que controlan la página      | `Cross-Origin-Opener-Policy: same-origin` y `rel="noopener noreferrer"` en enlaces externos                            | `public/_headers`, componentes                                           | Prueba de build (todos los `target="_blank"` llevan `noopener`)       |
| Formularios hacia destinos ajenos              | `form-action 'self' https://wa.me https://api.whatsapp.com`                                                            | CSP (`<meta>` y cabecera)                                                | Prueba de build                                                       |
| Datos personales en analítica                  | Lista blanca de eventos y parámetros; valores tipo _slug_ (una placa o teléfono nunca pasan)                           | `src/lib/analytics.ts`                                                   | Pruebas unitarias y E2E (`generate_lead` sin placa)                   |
| Terceros innecesarios                          | Fuentes e íconos auto-alojados; GA4 solo si se define `PUBLIC_GA4_ID`, y sus dominios solo entran a la CSP en ese caso | `astro.config.mjs`                                                       | Prueba de build: sin hojas de estilo ni scripts externos              |
| Dependencias vulnerables                       | `pnpm audit` en el CI y Dependabot semanal                                                                             | `.github/`                                                               | CI                                                                    |
| Datos de entrada                               | Placa normalizada a `[A-Z0-9]` y mensaje con `encodeURIComponent`                                                      | `src/lib/quote-validation.ts`, `src/lib/whatsapp.ts`                     | Pruebas unitarias                                                     |

### Riesgo aceptado en herramientas de desarrollo

`pnpm audit` (todas las dependencias) reporta 3 avisos sin parche disponible, todos dentro de `@lhci/cli` (Lighthouse CI): `extract-zip` (alto, 2 avisos) y `sprintf-js` (moderado). Son herramientas que solo corren en el equipo o en el CI, nunca llegan al sitio publicado, y no procesan datos de terceros. Los avisos con parche (`tmp`, `basic-ftp` y `uuid`) se corrigen con `pnpm.overrides` en `package.json`. El CI bloquea solo si aparece una vulnerabilidad alta en las dependencias de producción (`pnpm audit --prod --audit-level=high`). Hay que revisarlo de nuevo cuando `@lhci/cli` publique una versión que actualice esas dependencias.

## 2. Controles que no aplican (y cuándo reevaluarlos)

Como no hay servidor ni datos guardados, estos controles **no aplican**. Si algún día se agrega un backend (por ejemplo, para guardar leads o enviar recordatorios), hay que implementarlos antes de publicar ese cambio:

| Control                         | Por qué no aplica hoy                                                    | Si se agrega backend                                              |
| ------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Autenticación y autorización    | No hay cuentas ni áreas privadas                                         | Contraseñas con hash (Argon2/bcrypt), roles y mínimo privilegio   |
| Protección de sesiones          | No hay sesiones                                                          | Cookies `HttpOnly`, `Secure` y `SameSite`, con expiración         |
| CSRF                            | No hay peticiones que cambien datos                                      | Token anti-CSRF o `SameSite=strict`                               |
| Rate limiting                   | No hay endpoint (Cloudflare ya mitiga DDoS)                              | Límite por IP en el Worker o con reglas de Cloudflare             |
| SQL injection                   | No hay base de datos                                                     | Consultas parametrizadas u ORM                                    |
| CORS                            | No hay API                                                               | Solo el origen propio, nunca `*` con credenciales                 |
| Validación del servidor         | No hay servidor                                                          | Validar con el mismo esquema que el cliente (zod)                 |
| Antispam                        | El formulario no envía nada a un servidor; el spam llegaría por WhatsApp | Turnstile (gratis) y un campo trampa (_honeypot_)                 |
| Variables de entorno y secretos | No hay secretos: `PUBLIC_GA4_ID` es público por diseño                   | Secretos solo en Cloudflare o en GitHub Secrets, nunca en el repo |

## 3. Seguridad de las cuentas (el riesgo real de un sitio estático)

Quien controle estas cuentas controla el sitio o el canal de ventas. Un WhatsApp robado sirve, por ejemplo, para estafar a los clientes en nombre de SOAT YA. Checklist para ti y para el cliente:

- [ ] **GitHub:** verificación en dos pasos (2FA) y llaves de recuperación guardadas.
- [ ] **Cloudflare:** 2FA y acceso solo de quien lo necesita.
- [ ] **Google (GA4, Search Console):** 2FA.
- [ ] **Facebook / Meta Business:** 2FA.
- [ ] **WhatsApp Business:** verificación en dos pasos con PIN (Ajustes → Cuenta → Verificación en dos pasos).
- [ ] **Gestor de contraseñas** con contraseñas únicas por servicio.
- [ ] **Registrador del dominio** (cuando se compre): 2FA y bloqueo de transferencia.

## 4. Verificación tras desplegar (F9.3)

- https://securityheaders.com sobre la URL publicada: meta, nota A.
- Revisar en la consola del navegador que no aparezcan violaciones de CSP (también en Brave y Safari).
- Probar el sitio dentro de un iframe en otro dominio: debe negarse a cargar.
