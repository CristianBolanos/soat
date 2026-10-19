/**
 * Valida el HTML de dist/ con el Nu HTML Checker (el validador oficial del W3C).
 * - Con Java instalado (CI en GitHub Actions) usa vnu.jar local.
 * - Sin Java (equipo local) envía cada página al servicio público validator.w3.org/nu.
 *
 * Falla solo con errores de HTML. Los mensajes "CSS:" vienen del CSS en línea que
 * genera Tailwind v4 (p. ej. `@property`), que el validador aún no reconoce: se
 * informan como falsos positivos conocidos y el CSS se revisa
 * a mano en el validador CSS del W3C (plan, tarea F9.3).
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const DIST = 'dist';

function listHtml(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listHtml(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

function hasJava() {
  return spawnSync('java', ['-version'], { stdio: 'ignore' }).status === 0;
}

function messagesFromJar(files) {
  const jar = String(createRequire(import.meta.url)('vnu-jar'));
  const run = spawnSync('java', ['-jar', jar, '--errors-only', '--format', 'json', ...files], {
    encoding: 'utf8',
  });
  const { messages = [] } = JSON.parse(run.stderr || '{"messages":[]}');
  return messages.map((m) => ({ ...m, file: m.url ?? '?' }));
}

async function messagesOnline(file) {
  const response = await fetch('https://validator.w3.org/nu/?out=json', {
    method: 'POST',
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'User-Agent': 'soat-ya-ci' },
    body: readFileSync(file),
  });
  const { messages = [] } = await response.json();
  return messages.filter((m) => m.type === 'error').map((m) => ({ ...m, file }));
}

async function collectMessages(files) {
  if (hasJava()) return messagesFromJar(files);
  const all = await Promise.all(files.map(messagesOnline));
  return all.flat();
}

const files = listHtml(DIST);
if (files.length === 0) {
  console.error('No hay HTML en dist/. Ejecuta `pnpm build` primero.');
  process.exit(1);
}

const messages = await collectMessages(files);
const cssNotices = messages.filter((m) => m.message.startsWith('CSS:'));
const htmlErrors = messages.filter((m) => !m.message.startsWith('CSS:'));

for (const error of htmlErrors) {
  console.error(`${error.file}:${error.lastLine ?? '?'}: ${error.message}`);
}
if (cssNotices.length > 0) {
  const kinds = [...new Set(cssNotices.map((m) => m.message))].join(' | ');
  console.log(`W3C: ${cssNotices.length} aviso(s) de CSS moderno ignorados (${kinds}).`);
}
console.log(
  htmlErrors.length === 0
    ? `W3C: ${files.length} página(s) sin errores de HTML.`
    : `W3C: ${htmlErrors.length} error(es) de HTML.`,
);
process.exit(htmlErrors.length === 0 ? 0 : 1);
