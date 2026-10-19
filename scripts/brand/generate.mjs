/**
 * Genera los recursos de marca a partir de la fuente real (docs/marca.md):
 *   - src/components/ui/logo-geometry.ts  (trazados del logo para el componente)
 *   - public/favicon.svg, favicon.ico, apple-touch-icon.png, icon-*.png, manifest.webmanifest
 *   - public/og-image.png                 (1200×630, sin año ni precios)
 *   - src/assets/hero/hero-chat.png       (ilustración del hero, 1200 px; Astro la pasa a AVIF/WebP)
 *   - docs/marca/hero-chat.svg            (fuente vectorial de la ilustración)
 *   - docs/marca/logo*.svg                (vistas previas para la guía de marca)
 * Uso: pnpm brand
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import sharp from 'sharp';
import { loadFont } from './fonts.mjs';
import { heroSvg } from './hero.mjs';
import { appIconSvg, buildIco, faviconSvg, manifest, svgToPng } from './icons.mjs';
import { COLORS, logoGeometry, logoSvg } from './logo.mjs';
import { ogSvg } from './og.mjs';

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log(`✓ ${path}`);
}

function logoModule(geometry) {
  return [
    '// Generado por scripts/brand/generate.mjs (pnpm brand). No editar a mano.',
    `export const logoGeometry = ${JSON.stringify(geometry, null, 2)} as const;`,
    '',
  ].join('\n');
}

async function writeIcons(font800) {
  write('public/favicon.svg', faviconSvg(font800));
  const icoPngs = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, data: await svgToPng(faviconSvg(font800, size)) })),
  );
  write('public/favicon.ico', buildIco(icoPngs));
  write('public/apple-touch-icon.png', await svgToPng(appIconSvg(font800, 180)));
  write('public/icon-192.png', await svgToPng(appIconSvg(font800, 192)));
  write('public/icon-512.png', await svgToPng(appIconSvg(font800, 512)));
  write('public/icon-maskable-512.png', await svgToPng(appIconSvg(font800, 512, { safe: true })));
  write('public/manifest.webmanifest', `${JSON.stringify(manifest(), null, 2)}\n`);
}

const font500 = loadFont(500);
const font800 = loadFont(800);
const logo = logoGeometry(font800);

write('src/components/ui/logo-geometry.ts', logoModule(logo));
write('docs/marca/logo.svg', logoSvg(logo, COLORS.navy));
write('docs/marca/logo-oscuro.svg', logoSvg(logo, COLORS.light));
await writeIcons(font800);

const og = ogSvg({ font800, font500, logo });
write('public/og-image.png', await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toBuffer());
const hero = heroSvg({ font500, font800 });
write('docs/marca/hero-chat.svg', hero);
// PNG grande y sin pérdida: Astro genera los AVIF/WebP responsive en el build.
// (No se rasteriza el SVG en Astro para no activar image.dangerouslyProcessSVG.)
const heroPng = await sharp(Buffer.from(hero), { density: 144 * 2 })
  .resize({ width: 1200 })
  .png({ compressionLevel: 9 })
  .toBuffer();
write('src/assets/hero/hero-chat.png', heroPng);
