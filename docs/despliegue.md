# Despliegue en Cloudflare Pages (F2.6, F9 y F11)

Todo es gratis; el único costo opcional es el dominio propio. Los pasos marcados con 👤 los haces tú, porque requieren iniciar sesión en tus cuentas.

**Idea general:** primero se publica una **vista previa** de la rama `astro-migration` (con `noindex`, Google no la indexa) para hacer F9. El sitio viejo sigue funcionando igual. Solo después de la compuerta G3 se pasa a producción.

## 1. 👤 Crear el proyecto en Cloudflare Pages (una sola vez)

1. Entra a https://dash.cloudflare.com (crea la cuenta si no la tienes) y **activa la verificación en dos pasos**: My Profile → Authentication.
2. Menú **Workers y Pages** → **Crear** → pestaña **Pages** → **Conectar a Git** (o _Import an existing Git repository_). Si el asistente te ofrece crear un **Worker**, busca abajo el enlace _Looking to deploy Pages? Get started_: este proyecto va en **Pages**.
3. Autoriza la app de Cloudflare en GitHub. Cuando pregunte por los repositorios, elige **Only select repositories** → `cristianbolanos/soat`.
4. Selecciona `soat` → **Comenzar configuración** y completa:
   - **Nombre del proyecto:** `soat-ya` (define la URL `https://soat-ya.pages.dev`; si está ocupado, usa otro y avísame para cambiar `SITE_URL`)
   - **Rama de producción:** `main`
   - **Framework preset:** `Astro`
   - **Comando de build:** `pnpm build`
   - **Directorio de salida:** `dist`
   - **Directorio raíz:** déjalo vacío.
   - **Variables de entorno** → agrega `PNPM_VERSION` = `10.17.1`. No agregues `NODE_VERSION`: Cloudflare toma la versión exacta del archivo `.node-version` (Astro exige Node 22.22 o superior).
5. **Guardar y desplegar.** El primer despliegue (de `main`) **va a fallar, y es normal**: `main` todavía tiene el sitio viejo, sin `package.json`. No afecta al sitio viejo.
6. En el proyecto: **Settings → Builds → Branch control**:
   - **Automatic deployments** de producción: **desactivado** hasta la compuerta G3.
   - **Preview branches:** _All non-production branches_.
7. En el proyecto: **Metrics → Web Analytics → Enable** (gratis y sin cookies). Se activa desde el siguiente despliegue, y así en F9 compruebo que no choca con la CSP.
8. **[Opcional]** Si ya creaste la propiedad de GA4 (pasos en `docs/medicion.md`): **Settings → Variables and Secrets** → agrega `PUBLIC_GA4_ID` = `G-…` en _Production_ y en _Preview_. Así en F9 compruebo en DebugView que llegan los eventos. Sin esta variable, GA4 no se carga.

## 2. 👤 Subir la rama de trabajo a GitHub (solo la rama, no `main`)

Hazlo **después** del paso 1: Cloudflare solo construye la vista previa con un push hecho después de crear el proyecto. Puedes hacerlo tú o pedírmelo. En la terminal, dentro de la carpeta del proyecto:

```bash
git push -u origin astro-migration
```

Si Git pide iniciar sesión, se abre el navegador con GitHub. Cloudflare detecta el push y construye la vista previa en unos 2 minutos. La URL queda así:

```
https://astro-migration.soat-ya.pages.dev
```

(también está en Cloudflare → el proyecto → **Deployments**).

**Recomendado:** con tu visto bueno, abro un PR **en borrador** de `astro-migration` → `main`. Así el CI corre por primera vez en GitHub (en Linux, como Cloudflare) y el PR muestra el estado de la vista previa. Un PR en borrador no publica nada en producción ni se puede fusionar por error.

## 3. Comprobar la vista previa (lo hago yo)

```bash
curl -sI https://astro-migration.soat-ya.pages.dev | grep -iE "x-robots-tag|strict-transport|x-frame|content-security"
```

Debe mostrar `x-robots-tag: noindex` (la vista previa no se indexa), HSTS, `x-frame-options: DENY` y `frame-ancestors 'none'`.

## 4. F9: verificación sobre la vista previa

**Lo hago yo**, con la URL de la vista previa:

- PageSpeed Insights en móvil y escritorio (3 corridas). El SEO marcará `noindex` porque es una vista previa; el 100 de SEO se confirma en producción.
- securityheaders.com (meta: A), validador W3C de HTML y CSS, WAVE, y Rich Results Test para el JSON-LD.
- Revisión de consola: sin violaciones de CSP.

**Lo haces tú (👤):** la checklist de `docs/qa-checklist.md` en tus celulares y navegadores (Android, iPhone, Brave y Opera).

**[Opcional]** WebPageTest (https://www.webpagetest.org, requiere cuenta gratuita): perfil «Moto G Power, 4G».

## 5. 👤 Proteger la rama `main` en GitHub

**Settings → Branches → Add rule** para `main`:

- Requerir pull request antes de hacer merge.
- Requerir que pase el check **CI / quality** (aparece cuando el CI corre por primera vez, al abrir el PR del paso 2).

## 6. Lanzamiento (F11, después de la compuerta G3)

1. **Fecha de vigencia de la política:** se fija `policyDate` (AAAA-MM-DD) en `src/config/site.ts` con la fecha de publicación.
2. **Puerta de lanzamiento:** `pnpm build && pnpm test:release` debe pasar.
3. **Sitio viejo de GitHub Pages:** antes de tocar `main`, se crea la rama `gh-pages` con una página que redirige a la URL nueva conservando el `#ancla`. 👤 En GitHub → Settings → Pages, cambias la fuente a `gh-pages`. Así el enlace viejo nunca queda roto.
4. Se hace merge del PR `astro-migration` → `main`, con tu confirmación, y 👤 se activan los despliegues automáticos de producción en Cloudflare.
5. **Analítica:** se comprueba que Web Analytics (paso 1.7) cuente las visitas de producción. **[Opcional]** Si GA4 no se activó antes, se activa ahora con `PUBLIC_GA4_ID` (ver `docs/medicion.md`).
6. 👤 **Search Console:** agrega una propiedad de tipo **Prefijo de URL** con `https://soat-ya.pages.dev/`. Como método de verificación elige **Etiqueta HTML**, copia solo el valor de `content` y pásamelo: lo agrego al sitio y se publica. El método de Google Analytics no sirve aquí, porque GA4 se carga después de la primera interacción. Ya verificada la propiedad, envía `sitemap-index.xml` e inspecciona la URL principal.
7. 👤 Actualiza el enlace en Facebook y en el perfil de WhatsApp Business.

## 7. Volver atrás (plan de reversa)

- **Cloudflare:** Deployments → elige el despliegue anterior → **Rollback**. Tarda segundos.
- **GitHub Pages:** volver a poner la fuente en `main` devuelve el sitio viejo tal como estaba.

## 8. Dominio propio [Opcional]

1. Compra el dominio (por ejemplo, `soatya.com.co`) y agrégalo en **Custom domains** del proyecto.
2. Cambia `SITE_URL` en `astro.config.mjs` y despliega (canonical, sitemap, robots y OG se actualizan solos).
3. Crea en Cloudflare una redirección 301 de `soat-ya.pages.dev` al dominio nuevo (Bulk Redirects, gratis).
