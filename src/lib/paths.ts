/**
 * Rutas del sitio con la base de despliegue. En Cloudflare Pages el sitio vive en la raíz
 * (`/`); en GitHub Pages, bajo `/soat/` (se define con `DEPLOY_BASE` al compilar, ver
 * astro.config.mjs). Todo enlace o archivo propio que empiece con «/» debe pasar por
 * `withBase`; lo que genera Astro (CSS, JS, imágenes y fuentes) ya la incluye.
 */

/** Base sin barra final: '' en la raíz, '/soat' bajo un subdirectorio. */
export function basePrefix(base: string): string {
  return base.replace(/\/+$/, '');
}

/** Antepone la base a una ruta del sitio que empieza con «/» (`/` es la portada). */
export function joinBase(base: string, path: string): string {
  if (!path.startsWith('/')) throw new Error(`La ruta debe empezar con «/»: ${path}`);
  return `${basePrefix(base)}${path}`;
}

/** Quita la base de una ruta recibida del navegador o de Astro (`/soat/terminos` → `/terminos`). */
export function stripBase(base: string, path: string): string {
  const prefix = basePrefix(base);
  if (prefix === '' || !path.startsWith(prefix)) return path;
  return path.slice(prefix.length) || '/';
}

/** `joinBase` con la base real de este build. */
export function withBase(path: string): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
