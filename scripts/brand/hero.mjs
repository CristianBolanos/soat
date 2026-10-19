/**
 * Ilustración del hero: un chat donde el cliente envía su placa y recibe la
 * póliza en PDF. Fondo transparente para que funcione en tema claro y oscuro.
 * El generador la exporta a PNG (src/assets/hero/hero-chat.png) y Astro la pasa a AVIF/WebP.
 */
import { textInBox, textLine, textWidth } from './fonts.mjs';
import { COLORS } from './logo.mjs';

const LINE = 18;
const PAD_X = 12;

/** Burbuja de chat con ancho calculado según el texto. */
function bubble(font, { x, y, lines, size = 12, align = 'left', fill, stroke }) {
  const width = Math.max(...lines.map((l) => textWidth(font, l, size))) + PAD_X * 2;
  const height = lines.length * LINE + 16;
  const left = align === 'right' ? x - width : x;
  const border = stroke ? ` stroke="${stroke}" stroke-width="1.5"` : '';
  const text = lines
    .map(
      (l, i) =>
        `<path d="${textLine(font, l, { size, x: left + PAD_X, y: y + 22 + i * LINE })}" fill="${COLORS.navy}"/>`,
    )
    .join('');
  return `<rect x="${left}" y="${y}" width="${width}" height="${height}" rx="14" fill="${fill}"${border}/>${text}`;
}

function phone({ font500, font800 }) {
  const name = textLine(font800, 'SOAT YA', { size: 15, x: 258, y: 79 });
  const role = textLine(font500, 'Asesor', { size: 11, x: 258, y: 95 });
  const avatar = textInBox(font800, 'YA', 11, { left: 217, top: 76, width: 30, align: 'center' });
  return [
    `<rect x="190" y="30" width="240" height="460" rx="38" fill="${COLORS.navy}"/>`,
    `<rect x="202" y="42" width="216" height="436" rx="28" fill="${COLORS.surface}"/>`,
    `<rect x="202" y="42" width="216" height="66" rx="28" fill="${COLORS.green}"/>`,
    `<rect x="202" y="80" width="216" height="28" fill="${COLORS.green}"/>`,
    `<rect x="280" y="50" width="60" height="8" rx="4" fill="${COLORS.navy}"/>`,
    `<circle cx="232" cy="82" r="16" fill="${COLORS.yellow}"/>`,
    `<path d="${avatar.d}" fill="${COLORS.navy}"/>`,
    `<path d="${name}" fill="${COLORS.white}"/>`,
    `<path d="${role}" fill="${COLORS.greenTint}"/>`,
  ].join('');
}

function policyCard({ font500, font800 }) {
  const pdf = textInBox(font800, 'PDF', 8.5, { left: 226, top: 300, width: 26, align: 'center' });
  return [
    `<rect x="214" y="272" width="182" height="64" rx="14" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1.5"/>`,
    `<rect x="226" y="287" width="26" height="34" rx="5" fill="${COLORS.blue}"/>`,
    `<path d="${pdf.d}" fill="${COLORS.white}"/>`,
    `<path d="${textLine(font800, 'Póliza SOAT', { size: 12.5, x: 262, y: 301 })}" fill="${COLORS.navy}"/>`,
    `<path d="${textLine(font500, 'Verifícala en el RUNT', { size: 11, x: 262, y: 319 })}" fill="#475569"/>`,
  ].join('');
}

function inputBar({ font500 }) {
  return [
    `<rect x="214" y="430" width="152" height="34" rx="17" fill="${COLORS.white}" stroke="${COLORS.line}" stroke-width="1.5"/>`,
    `<path d="${textLine(font500, 'Escribe un mensaje', { size: 11, x: 230, y: 451 })}" fill="#94A3B8"/>`,
    `<circle cx="389" cy="447" r="17" fill="${COLORS.green}"/>`,
    `<path d="M382 447h12m-5-5 5 5-5 5" fill="none" stroke="${COLORS.white}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  ].join('');
}

function floatingPlate({ font800 }) {
  const [x, y, w, h] = [36, 360, 196, 82];
  const label = textInBox(font800, 'ABC12D', 40, {
    left: x,
    top: y + 22,
    width: w,
    align: 'center',
  });
  return [
    `<g transform="rotate(-8 ${x + w / 2} ${y + h / 2})">`,
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${COLORS.yellow}" stroke="${COLORS.navy}" stroke-width="6"/>`,
    `<circle cx="${x + 16}" cy="${y + 16}" r="4" fill="${COLORS.navy}"/>`,
    `<circle cx="${x + w - 16}" cy="${y + 16}" r="4" fill="${COLORS.navy}"/>`,
    `<path d="${label.d}" fill="${COLORS.navy}"/>`,
    '</g>',
  ].join('');
}

function checkBadge() {
  return [
    `<circle cx="472" cy="118" r="34" fill="${COLORS.green}" stroke="${COLORS.navy}" stroke-width="5"/>`,
    `<path d="M458 119l10 10 19-20" fill="none" stroke="${COLORS.white}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  ].join('');
}

export function heroSvg(fonts) {
  const { font500 } = fonts;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 520" width="600" height="520">',
    '<circle cx="320" cy="268" r="205" fill="#FFE9A8"/>',
    phone(fonts),
    bubble(font500, {
      x: 406,
      y: 124,
      lines: ['Hola, quiero el SOAT', 'de mi moto ABC12D'],
      align: 'right',
      fill: COLORS.greenTint,
    }),
    bubble(font500, {
      x: 214,
      y: 196,
      lines: ['¡Hola! Ya reviso los', 'datos de tu moto.'],
      fill: COLORS.white,
      stroke: COLORS.line,
    }),
    policyCard(fonts),
    inputBar(fonts),
    floatingPlate(fonts),
    checkBadge(),
    '</svg>',
  ].join('');
}
