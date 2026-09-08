// Writes the rendered token CSS to dist/. Run with `vite-node src/build-css.ts` (no extra
// dependency; vite-node ships with Vitest). The output is git-ignored and rebuilt in CI.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCss } from './render-css';

const here = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(here, '../dist/tokens.generated.css');
const css = renderCss();
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, css, 'utf8');
console.log(`tokens: wrote ${outPath}`);
