/**
 * Carga Plus Jakarta Sans (estática, WOFF) y convierte texto en trazados SVG.
 * Así el logo, los íconos y las imágenes se ven igual sin depender de fuentes
 * instaladas (sharp rasteriza el SVG sin acceso a la fuente web).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import opentype from 'opentype.js';

const FONT_DIR = join(process.cwd(), 'node_modules/@fontsource/plus-jakarta-sans/files');

/** @param {500 | 700 | 800} weight */
export function loadFont(weight) {
  const buf = readFileSync(join(FONT_DIR, `plus-jakarta-sans-latin-${weight}-normal.woff`));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

/**
 * Composición simple glifo por glifo (avance + kerning de la fuente). Evita el motor
 * de «shaping» de opentype.js 2.0, que no soporta un lookup `ccmp` de esta fuente;
 * para textos latinos cortos el resultado es el mismo.
 */
function layout(font, text, { size, x, y }) {
  const scale = size / font.unitsPerEm;
  const glyphs = [...text].map((char) => font.charToGlyph(char));
  const path = new opentype.Path();
  let cursor = x;
  glyphs.forEach((glyph, i) => {
    path.extend(glyph.getPath(cursor, y, size));
    cursor += glyph.advanceWidth * scale;
    if (glyphs[i + 1]) cursor += font.getKerningValue(glyph, glyphs[i + 1]) * scale;
  });
  return { path, advance: cursor - x };
}

/** Número con 2 decimales, sin ceros sobrantes. */
const num = (v) => String(Number(v.toFixed(2)));

/**
 * Serializa los comandos a `d` de SVG. No se usa `Path.toPathData` de opentype.js 2.0:
 * su redondeo devuelve NaN con decimales muy pequeños, invierte el eje Y y «optimiza»
 * por defecto, y las tres cosas rompen el trazado.
 */
function toD(commands) {
  return commands
    .map((c) => {
      if (c.type === 'M' || c.type === 'L') return `${c.type}${num(c.x)} ${num(c.y)}`;
      if (c.type === 'Q') return `Q${num(c.x1)} ${num(c.y1)} ${num(c.x)} ${num(c.y)}`;
      if (c.type === 'C')
        return `C${num(c.x1)} ${num(c.y1)} ${num(c.x2)} ${num(c.y2)} ${num(c.x)} ${num(c.y)}`;
      return 'Z';
    })
    .join('');
}

/**
 * Trazado de un texto con la línea base en (x, y).
 * @returns {{ d: string, box: { x1: number, y1: number, x2: number, y2: number } }}
 */
export function textPath(font, text, { size, x = 0, y = 0 }) {
  const { path } = layout(font, text, { size, x, y });
  return { d: toD(path.commands), box: path.getBoundingBox() };
}

/** Ancho de avance del texto (incluye kerning). */
export function textWidth(font, text, size) {
  return layout(font, text, { size, x: 0, y: 0 }).advance;
}

/**
 * Trazado de un texto cuya caja queda dentro de (left, top), alineado a la izquierda,
 * al centro o a la derecha de `width`.
 */
export function textInBox(font, text, size, { left, top, width = 0, align = 'left' }) {
  const probe = textPath(font, text, { size });
  const w = probe.box.x2 - probe.box.x1;
  const offset = align === 'center' ? (width - w) / 2 : align === 'right' ? width - w : 0;
  return textPath(font, text, { size, x: left + offset - probe.box.x1, y: top - probe.box.y1 });
}

/** Texto con la línea base en (x, y): útil para párrafos de varias líneas. */
export function textLine(font, text, { size, x, y }) {
  return textPath(font, text, { size, x, y }).d;
}
