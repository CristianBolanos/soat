/**
 * Año calendario en una zona horaria dada (por defecto, Colombia).
 * Se evalúa al compilar el sitio, así los textos con «SOAT {año}» nunca quedan
 * escritos a mano (decisión T10).
 */
export function currentYear(timeZone = 'America/Bogota', date: Date = new Date()): number {
  const year = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric' }).format(date);
  return Number(year);
}
