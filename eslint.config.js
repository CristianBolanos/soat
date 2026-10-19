// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Reglas de "código limpio" verificables (plan, tarea F2.3):
 * funciones y archivos cortos, complejidad acotada y sin APIs que abran XSS.
 *
 * @type {import('eslint').Linter.RulesRecord}
 */
const cleanCodeRules = {
  'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
  'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
  complexity: ['error', 10],
  'max-depth': ['error', 3],
  'max-params': ['error', 4],
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-func': 'error',
  'no-restricted-syntax': [
    'error',
    {
      selector: 'AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]',
      message: 'Usa textContent o nodos del DOM: innerHTML/outerHTML abren la puerta a XSS.',
    },
    {
      selector: "CallExpression[callee.property.name='insertAdjacentHTML']",
      message: 'Usa insertAdjacentElement/insertAdjacentText en lugar de insertAdjacentHTML.',
    },
    {
      selector: "CallExpression[callee.object.name='document'][callee.property.name='write']",
      message: 'document.write no está permitido.',
    },
  ],
};

export default defineConfig(
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'legacy/',
      'playwright-report/',
      'test-results/',
      '.lighthouseci/',
      'coverage/',
      'docs/linea-base/',
      'docs/wireframes/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: cleanCodeRules,
  },
  {
    // Los bloques describe/test de las pruebas son largos por naturaleza.
    files: ['tests/**/*.ts', 'scripts/**/*.mjs'],
    rules: { 'max-lines-per-function': 'off' },
  },
);
