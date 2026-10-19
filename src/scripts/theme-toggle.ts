import { track } from '@/lib/analytics';
import {
  THEME_STORAGE_KEY,
  isTheme,
  nextTheme,
  resolveTheme,
  toggleLabel,
  type Theme,
} from '@/lib/theme';

const media = window.matchMedia('(prefers-color-scheme: dark)');

function readStored(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null; // Modo privado o almacenamiento bloqueado: se usa el tema del sistema.
  }
}

function store(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sin almacenamiento, la elección dura solo esta visita.
  }
}

function currentTheme(): Theme {
  const applied = document.documentElement.dataset['theme'];
  return isTheme(applied) ? applied : resolveTheme(readStored(), media.matches);
}

function apply(theme: Theme): void {
  document.documentElement.dataset['theme'] = theme;
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    button.setAttribute('aria-label', toggleLabel(theme));
  }
}

apply(currentTheme());

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target?.closest('[data-theme-toggle]')) return;
  const next = nextTheme(currentTheme());
  store(next);
  apply(next);
  track('theme_change', { tema: next === 'dark' ? 'oscuro' : 'claro' });
});

// Si el visitante no eligió tema, seguimos los cambios del sistema en vivo.
media.addEventListener('change', (event) => {
  if (!isTheme(readStored())) apply(event.matches ? 'dark' : 'light');
});
