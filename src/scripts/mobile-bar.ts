/**
 * Muestra la barra fija móvil cuando el cotizador no está en pantalla. En páginas
 * sin cotizador (legales, 404) queda siempre visible.
 */
const bar = document.querySelector<HTMLElement>('[data-mobile-bar]');
const form = document.getElementById('cotizador-pasos');

function setVisible(visible: boolean): void {
  bar?.classList.toggle('invisible', !visible);
  bar?.classList.toggle('translate-y-full', !visible);
  if (bar) bar.dataset['visible'] = String(visible);
}

if (bar && form && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[entries.length - 1];
    setVisible(!entry?.isIntersecting);
  });
  observer.observe(form);
} else {
  setVisible(Boolean(bar));
}
