/**
 * Lógica del tema claro/oscuro (plan, F3.4). Sin preferencia guardada se sigue
 * al sistema; sin preferencia del sistema, el sitio arranca en claro.
 *
 * Nota: el script en línea de `BaseLayout.astro` replica `resolveTheme` en pocas
 * líneas porque debe ejecutarse antes del primer pintado, sin importar módulos.
 */
export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function resolveTheme(stored: unknown, systemPrefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return systemPrefersDark ? 'dark' : 'light';
}

export function nextTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

/** Texto accesible del botón: describe la acción, no el estado. */
export function toggleLabel(current: Theme): string {
  return current === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro';
}
