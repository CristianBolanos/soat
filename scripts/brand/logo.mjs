/**
 * Logo «SOAT [YA]»: «SOAT» en Plus Jakarta Sans ExtraBold y «YA» dentro de una
 * placa amarilla con borde, como las placas colombianas (docs/marca.md).
 */
import { textInBox, textPath } from './fonts.mjs';

export const COLORS = {
  navy: '#0B1F3A',
  yellow: '#FFC629',
  light: '#E6EDF7',
  muted: '#9FB0C8',
  green: '#0B7A43',
  greenTint: '#D7F5E3',
  blue: '#1F4FD1',
  surface: '#F5F7FB',
  line: '#E2E8F0',
  white: '#FFFFFF',
};

const round = (n) => Math.round(n * 100) / 100;

/** Geometría del logo en unidades de un tamaño de fuente de 100. */
export function logoGeometry(font) {
  const soat = textPath(font, 'SOAT', { size: 100 });
  const capTop = soat.box.y1;
  const capHeight = soat.box.y2 - soat.box.y1;
  const stroke = 7;
  const padY = capHeight * 0.17;
  const plate = { x: soat.box.x2 + 20, y: capTop - padY, h: capHeight + padY * 2 };

  const yaProbe = textPath(font, 'YA', { size: 66 });
  const yaWidth = yaProbe.box.x2 - yaProbe.box.x1;
  const yaHeight = yaProbe.box.y2 - yaProbe.box.y1;
  plate.w = yaWidth + padY * 3.2;
  plate.rx = plate.h * 0.16;

  const ya = textInBox(font, 'YA', 66, {
    left: plate.x,
    top: plate.y + (plate.h - yaHeight) / 2,
    width: plate.w,
    align: 'center',
  });
  const inset = plate.h * 0.13;
  const bolts = [plate.x + inset, plate.x + plate.w - inset].map((cx) => ({
    cx: round(cx),
    cy: round(plate.y + inset),
    r: round(plate.h * 0.035),
  }));

  const minX = soat.box.x1 - 2;
  const minY = plate.y - stroke / 2 - 1;
  const width = plate.x + plate.w + stroke / 2 + 1 - minX;
  const height = plate.h + stroke + 2;
  return {
    viewBox: [minX, minY, width, height].map(round),
    soat: soat.d,
    ya: ya.d,
    plate: {
      x: round(plate.x),
      y: round(plate.y),
      w: round(plate.w),
      h: round(plate.h),
      rx: round(plate.rx),
    },
    bolts,
    stroke,
  };
}

/** Placa con «YA» en un cuadro de `size` (favicon e íconos). */
export function plateMark(font, size, { inset = 0 } = {}) {
  const stroke = size * 0.075;
  const w = size - inset * 2 - stroke;
  const h = w * 0.72;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  const probe = textPath(font, 'YA', { size: 100 });
  const scale = Math.min(
    (w * 0.74) / (probe.box.x2 - probe.box.x1),
    (h * 0.62) / (probe.box.y2 - probe.box.y1),
  );
  const fontSize = 100 * scale;
  const textHeight = (probe.box.y2 - probe.box.y1) * scale;
  const ya = textInBox(font, 'YA', fontSize, {
    left: x,
    top: y + (h - textHeight) / 2,
    width: w,
    align: 'center',
  });
  return [
    `<rect x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(h)}" rx="${round(h * 0.18)}" fill="${COLORS.yellow}" stroke="${COLORS.navy}" stroke-width="${round(stroke)}"/>`,
    `<path d="${ya.d}" fill="${COLORS.navy}"/>`,
  ].join('');
}

/** SVG autónomo del logo (para imágenes generadas). */
export function logoSvg(geometry, textColor) {
  const { viewBox, soat, ya, plate, bolts, stroke } = geometry;
  const boltMarkup = bolts
    .map((b) => `<circle cx="${b.cx}" cy="${b.cy}" r="${b.r}" fill="${COLORS.navy}"/>`)
    .join('');
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(' ')}">`,
    `<path d="${soat}" fill="${textColor}"/>`,
    `<rect x="${plate.x}" y="${plate.y}" width="${plate.w}" height="${plate.h}" rx="${plate.rx}" fill="${COLORS.yellow}" stroke="${COLORS.navy}" stroke-width="${stroke}"/>`,
    boltMarkup,
    `<path d="${ya}" fill="${COLORS.navy}"/>`,
    '</svg>',
  ].join('');
}
