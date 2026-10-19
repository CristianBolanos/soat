/**
 * Utilidades de texto. El espacio no separable se crea con su código (U+00A0) para
 * que sea visible en el código fuente y nadie lo reemplace sin querer al editar.
 */
export const NBSP = String.fromCharCode(0xa0);

/** Une las palabras con espacios no separables (p. ej. un teléfono que no debe partirse). */
export function nbsp(text: string): string {
  return text.replace(/ /g, NBSP);
}
