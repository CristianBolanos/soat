import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) };

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        // Pruebas de integración sobre el HTML generado en dist/ (requieren `pnpm build`).
        test: {
          name: 'build',
          include: ['tests/build/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        // Puerta de lanzamiento (F11): falla si quedan datos «[PENDIENTE…]» en el sitio.
        test: {
          name: 'release',
          include: ['tests/release/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
});
