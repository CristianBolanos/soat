/**
 * Año calendario en una zona horaria dada (por defecto, Colombia).
 * Se evalúa al compilar el sitio, así los textos con «SOAT {año}» nunca quedan
 * escritos a mano (decisión T10).
 */
export function currentYear(timeZone = 'America/Bogota', date: Date = new Date()): number {
  const year = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric' }).format(date);
  return Number(year);
}

/** «2026-10-18» → «18 de octubre de 2026» (fecha de calendario, sin zona horaria). */
export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1));
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
