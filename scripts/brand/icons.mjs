/**
 * Favicons e íconos de la app: SVG, ICO (16/32/48), apple-touch (180),
 * íconos del manifest (192, 512 y maskable 512).
 */
import sharp from 'sharp';
import { COLORS, plateMark } from './logo.mjs';

/** Favicon: solo la placa «YA» sobre fondo transparente. */
export function faviconSvg(font, px) {
  const size = 64;
  const dims = px ? ` width="${px}" height="${px}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"${dims}>${plateMark(font, size)}</svg>`;
}

/** Ícono de app: placa sobre fondo navy. `safe` reduce la placa para la zona segura (maskable). */
export function appIconSvg(font, px, { safe = false } = {}) {
  const size = 512;
  const inset = safe ? size * 0.2 : size * 0.1;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${px}" height="${px}">`,
    `<rect width="${size}" height="${size}" fill="${COLORS.navy}"/>`,
    plateMark(font, size, { inset }),
    '</svg>',
  ].join('');
}

/** Rasteriza un SVG que ya declara su tamaño en píxeles. */
export function svgToPng(svg) {
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

/** ICO con imágenes PNG embebidas (formato admitido por todos los navegadores actuales). */
export function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

export function manifest() {
  return {
    name: 'SOAT YA: tu SOAT de moto o carro por WhatsApp',
    short_name: 'SOAT YA',
    description: 'Cotiza y compra tu SOAT de moto o carro por WhatsApp.',
    lang: 'es-CO',
    start_url: '/',
    display: 'browser',
    background_color: COLORS.white,
    theme_color: COLORS.navy,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
