import { describe, expect, it } from 'vitest';
import { isTheme, nextTheme, resolveTheme, toggleLabel } from '../../src/lib/theme';

describe('lib/theme', () => {
  it('reconoce solo los temas válidos', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('auto')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it('la elección guardada gana sobre el sistema', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('sin elección guardada sigue al sistema', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('ignora valores guardados corruptos', () => {
    expect(resolveTheme('morado', false)).toBe('light');
  });

  it('alterna entre claro y oscuro', () => {
    expect(nextTheme('light')).toBe('dark');
    expect(nextTheme('dark')).toBe('light');
  });

  it('el texto del botón describe la acción', () => {
    expect(toggleLabel('light')).toBe('Activar tema oscuro');
    expect(toggleLabel('dark')).toBe('Activar tema claro');
  });
});
