# Despliegue en Cloudflare Pages (F2.6 y F11)

Todo es gratis. El único costo opcional es el dominio propio. Estos pasos se hacen **desde tu cuenta**, porque requieren iniciar sesión.

## 1. Conectar el repositorio (una sola vez)

1. Crea o abre tu cuenta en https://dash.cloudflare.com y **activa la verificación en dos pasos** (F8.3).
2. Ve a **Workers & Pages → Create → Pages → Connect to Git** y autoriza GitHub solo para el repo `cristianbolanos/soat`.
3. Configura así:
   - Production branch: `main`
   - Framework preset: `Astro`
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Variable de entorno: `NODE_VERSION = 22` (el repo también trae `.node-version`)
4. Nombre del proyecto: `soat-ya`. La URL queda en `https://soat-ya.pages.dev`. Si el nombre está ocupado, elige otro y cambia `SITE_URL` en `astro.config.mjs` y la URL de `public/robots.txt`.
5. Cada PR tendrá su propia URL de vista previa. Cloudflare marca esas previews con `noindex`; se comprueba con:

   ```bash
   curl -sI https://<id>.soat-ya.pages.dev | grep -i x-robots-tag
   ```

6. **Analítica sin cookies:** en el proyecto, ve a **Metrics → Web Analytics → Enable**.

## 2. Proteger la rama `main` en GitHub

En **Settings → Branches → Add rule** para `main`:

- Requerir pull request antes de hacer merge.
- Requerir que pase el check **CI / quality**.

Así solo llega a producción lo que pasó todas las pruebas.

## 3. Lanzamiento (F11, después de la compuerta G3)

1. Se hace merge del PR `astro-migration` a `main`, con tu confirmación. Cloudflare despliega solo.
2. **Redirección del sitio viejo:** el `index.html` de GitHub Pages se reemplaza por una página que redirige a la URL nueva conservando el `#ancla` (JS más `meta refresh` y `rel=canonical`).
3. **Search Console:** agrega la propiedad `https://soat-ya.pages.dev/`, envía `sitemap-index.xml` e inspecciona la URL principal.
4. Actualiza el enlace en Facebook y en el perfil de WhatsApp Business.

## 4. Volver atrás (plan de reversa)

- **Cloudflare:** Deployments → elige el despliegue anterior → **Rollback**. Tarda segundos.
- **Redirección:** revertir el commit en el repo del sitio viejo devuelve la página anterior.

## 5. Dominio propio [Opcional]

1. Compra el dominio (por ejemplo, `soatya.com.co`) y agrégalo en **Custom domains** del proyecto.
2. Cambia `SITE_URL` en `astro.config.mjs` y la URL de `public/robots.txt`, y vuelve a desplegar.
3. Crea en Cloudflare una redirección 301 de `soat-ya.pages.dev` al dominio nuevo (Bulk Redirects, gratis).
