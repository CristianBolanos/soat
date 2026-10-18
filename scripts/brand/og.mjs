/**
 * Imagen para compartir (Open Graph / X), 1200×630. Sin año ni precios
 * (decisiones D5 y T10), para que no haya que regenerarla cada enero.
 */
import { textLine } from './fonts.mjs';
import { COLORS, logoSvg } from './logo.mjs';

const W = 1200;
const H = 630;

function checkBadge(cx, cy, r) {
  const s = r / 40;
  const tick = `M${cx - 17 * s} ${cy + 1 * s} l${11 * s} ${11 * s} l${23 * s} ${-24 * s}`;
  return [
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${COLORS.green}" stroke="${COLORS.navy}" stroke-width="${6 * s}"/>`,
    `<path d="${tick}" fill="none" stroke="${COLORS.white}" stroke-width="${9 * s}" stroke-linecap="round" stroke-linejoin="round"/>`,
  ].join('');
}

function bigPlate(font800) {
  const x = 760;
  const y = 250;
  const w = 340;
  const h = 170;
  const label = textLine(font800, 'AL DÍA', { size: 74, x: x + 38, y: y + 112 });
  return [
    `<g transform="rotate(-7 ${x + w / 2} ${y + h / 2})">`,
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="26" fill="${COLORS.yellow}" stroke="${COLORS.navy}" stroke-width="10"/>`,
    `<circle cx="${x + 24}" cy="${y + 24}" r="7" fill="${COLORS.navy}"/>`,
    `<circle cx="${x + w - 24}" cy="${y + 24}" r="7" fill="${COLORS.navy}"/>`,
    `<path d="${label}" fill="${COLORS.navy}"/>`,
    '</g>',
    checkBadge(x + w - 6, y - 4, 46),
  ].join('');
}

export function ogSvg({ font800, font500, logo }) {
  const logoMarkup = logoSvg(logo, COLORS.white).replace(
    '<svg ',
    `<svg x="80" y="70" width="300" height="${Math.round((300 * logo.viewBox[3]) / logo.viewBox[2])}" `,
  );
  const headline = [
    `<path d="${textLine(font800, 'Tu SOAT de moto', { size: 70, x: 80, y: 300 })}" fill="${COLORS.white}"/>`,
    `<path d="${textLine(font800, 'o carro, por', { size: 70, x: 80, y: 384 })}" fill="${COLORS.white}"/>`,
    `<path d="${textLine(font800, 'WhatsApp', { size: 70, x: 80, y: 468 })}" fill="${COLORS.yellow}"/>`,
  ].join('');
  const sub = textLine(font500, 'Valor confirmado antes de pagar · Póliza verificable en el RUNT', {
    size: 27,
    x: 80,
    y: 548,
  });
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`,
    `<rect width="${W}" height="${H}" fill="${COLORS.navy}"/>`,
    `<circle cx="1000" cy="330" r="300" fill="#13294B"/>`,
    logoMarkup,
    headline,
    `<path d="${sub}" fill="${COLORS.muted}"/>`,
    bigPlate(font800),
    '</svg>',
  ].join('');
}
