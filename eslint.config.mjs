// Flat ESLint config.
//
// Beyond ordinary hygiene, this file MECHANICALLY ENFORCES two accepted architectural
// decisions, so they cannot decay into review discipline (ADR-0002 consequence, ADR-0005):
//
//   1. Inward dependency direction (ADR-0002 / system-architecture.md). The domain layer
//      imports nothing outward; the token layer is a leaf; UI never imports the app host.
//   2. Persian-first RTL (ADR-0005): physical left/right in CSS is caught by Stylelint
//      (see .stylelintrc.json); this file forbids `left`/`right` reaching JS/TSX style objects.
//
// The specific enforcement mechanism was left to GATE 2 by system-architecture.md ("The specific
// mechanism is chosen at GATE 2"); plain `no-restricted-imports` is chosen over a boundaries
// plugin because a three-package graph does not justify the extra abstraction (CLAUDE.md §5).

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

/** Physical-direction properties are forbidden in JS/TSX style objects too, not only in CSS. */
const noPhysicalDirectionSyntax = {
  selector:
    'Property[key.name=/^(left|right|marginLeft|marginRight|paddingLeft|paddingRight|borderLeft|borderRight|borderLeftWidth|borderRightWidth|borderTopLeftRadius|borderTopRightRadius|borderBottomLeftRadius|borderBottomRightRadius)$/]',
  message:
    'Physical left/right is prohibited (ADR-0005). Use CSS logical properties: inline-start / inline-end.',
};

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      'apps/web/public/**',
      '**/*.generated.*',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-restricted-syntax': ['error', noPhysicalDirectionSyntax],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // --- Layer boundary: DOMAIN depends on nothing outward (ADR-0002 rule 1, ADR-0003). ---
  {
    files: ['packages/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-dom',
                'next',
                'next/*',
                'drizzle-orm',
                'drizzle-orm/*',
                'zod',
                '@platform/ui',
                '@platform/ui/*',
                '@platform/tokens',
                '@platform/tokens/*',
                '@platform/web',
                '@platform/web/*',
              ],
              message:
                'The domain layer depends on nothing outward: no framework, vendor SDK, ORM, UI or token import (ADR-0002 rule 1, ADR-0003).',
            },
          ],
        },
      ],
    },
  },

  // --- Layer boundary: TOKENS is a leaf. ---
  {
    files: ['packages/tokens/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-dom',
                'next',
                'next/*',
                '@platform/ui',
                '@platform/domain',
                '@platform/web',
              ],
              message: 'The token layer is a leaf: it imports nothing but its own raw values.',
            },
          ],
        },
      ],
    },
  },

  // --- Layer boundary: UI may use tokens + domain + React, never the Next app host. ---
  {
    files: ['packages/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['next', 'next/*', '@platform/web', '@platform/web/*', 'drizzle-orm'],
              message:
                'UI primitives are host-agnostic: no Next or application-host import (system-architecture.md rule 5).',
            },
          ],
        },
      ],
    },
  },

  // --- React + browser surfaces (UI primitives and the app). ---
  {
    files: ['packages/ui/**/*.tsx', 'apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },

  // --- Next.js app. ---
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // App Router only; there is no `pages/` directory.
      '@next/next/no-html-link-for-pages': 'off',
    },
  },

  // --- Tests and tooling scripts. ---
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.ts',
      '**/tests/**',
      '**/*.config.{ts,mjs}',
      '**/build-*.ts',
    ],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      'no-restricted-imports': 'off',
      'no-console': 'off',
    },
  },

  prettier,
);
