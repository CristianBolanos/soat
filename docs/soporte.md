# Matriz de soporte de navegadores (F2.5)

## Navegadores objetivo

| Navegador                           | Versiones                      | Nivel                                                                                     |
| ----------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| Chrome (Android y escritorio), Edge | Últimas 2                      | Completo                                                                                  |
| Safari en iOS y macOS               | 16.4 o superior                | Completo                                                                                  |
| Safari en iOS                       | 15.x                           | Degradado aceptable: todo funciona y se ve legible, aunque puede perder detalles visuales |
| Firefox                             | Últimas 2 y ESR 128 o superior | Completo                                                                                  |
| Samsung Internet                    | Últimas 2                      | Completo                                                                                  |
| Brave y Opera (Chromium)            | Últimas 2                      | Completo. Se prueban con sus bloqueadores activados (R35)                                 |

**Por qué:** Tailwind CSS v4 está pensado para Safari 16.4+, Chrome 111+ y Firefox 128+, según su documentación. Desde la versión 4.1 incluye mejoras para que los navegadores anteriores degraden con menos problemas. Hay que verificarlo en un iPhone con iOS 15 si hay uno disponible. El JavaScript lo compila Vite 8 con su objetivo por defecto, _baseline widely available_.

## Funciones usadas y su respaldo (revisadas en Can I Use, R105)

| Función                                               | Para qué                                           | Soporte                                 | Si no está                                                                |
| ----------------------------------------------------- | -------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------- |
| Variables CSS                                         | Tokens de color y temas                            | Universal                               | —                                                                         |
| `@layer`                                              | Capas de Tailwind                                  | Safari 15.4+                            | En navegadores anteriores las capas se ignoran                            |
| `@property`                                           | Variables tipadas de Tailwind                      | Safari 16.4+, Firefox 128+              | Se pierden transiciones de sombras y gradientes; el contenido se ve igual |
| `color-mix()`                                         | Opacidades de Tailwind (`bg-x/50`)                 | Safari 16.2+                            | Se evita en elementos críticos; se usan tokens sólidos                    |
| `prefers-color-scheme`                                | Tema automático                                    | Universal                               | Tema claro                                                                |
| `prefers-reduced-motion`                              | Desactivar animaciones                             | Universal                               | —                                                                         |
| `:focus-visible`                                      | Anillo de foco                                     | Safari 15.4+                            | Sale el foco por defecto del navegador                                    |
| `text-wrap: balance`                                  | Títulos equilibrados                               | Chrome 114+, Safari 17.5+               | Ajuste normal (mejora progresiva)                                         |
| `content-visibility: auto` y `contain-intrinsic-size` | Preparar las secciones de abajo al acercarse (T32) | Chrome 85+, Firefox 125+, Safari 18+    | Se preparan todas al cargar, como antes (solo pierde velocidad)           |
| Unidades `dvh`                                        | Alto del hero en móvil                             | Safari 15.4+                            | Se declara antes un valor en `vh`                                         |
| `<details>` / `<summary>`                             | FAQ sin JS                                         | Universal                               | —                                                                         |
| `IntersectionObserver`                                | Ocultar la barra móvil                             | Universal                               | La barra queda siempre visible                                            |
| `localStorage`                                        | Recordar el tema                                   | Universal; puede fallar en modo privado | Va dentro de try/catch y se usa el tema del sistema                       |
| `fetchpriority`                                       | Sin uso desde D8 (el hero no tiene imagen)         | Chrome 101+, Safari 17.2+, Firefox 132+ | Se ignora sin efectos negativos                                           |
| AVIF con respaldo WebP en `<picture>`                 | Imágenes                                           | AVIF: Safari 16.4+                      | El navegador toma WebP                                                    |

## Cómo se verifica

- **Automático:** Playwright en Chromium, Firefox y WebKit, más Pixel 7 e iPhone 14 emulados.
- **Manual (F9.2):** Chrome en Android, Safari en iPhone, Firefox, Brave (con Shields), Opera y, de forma opcional, Samsung Internet.
- **Validación:** el HTML se valida con el Nu Checker del W3C. Los avisos de CSS moderno (`@property`, `margin-trim`) son falsos positivos conocidos del validador y quedan documentados en `docs/decisiones.md` (T6).
