import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CAPABILITY_LEDGER } from './capability-ledger';

// Drift guard, not a data-generation framework: it reads the canonical matrix Markdown and asserts
// the rendered ledger data matches it row for row — id, capability, target, actual and note. If the
// matrix's status (target/actual) or wording changes without the same change here, the in-product
// Truth Ledger would show something the canon does not, which is exactly the misleading drift
// ADR-0006 forbids. This does not generate the data; it only compares two hand-maintained sources.

// Resolve the canonical doc by walking up from the working directory, so the test holds whether it
// is run from the repo root (`pnpm test`) or from the package.
function findMatrix(): string {
  let dir = process.cwd();
  for (let i = 0; i < 6; i += 1) {
    const candidate = resolve(dir, 'docs/demo-truth-matrix.md');
    if (existsSync(candidate)) return candidate;
    dir = dirname(dir);
  }
  throw new Error(`demo-truth-matrix.md not found from ${process.cwd()}`);
}

const MATRIX_PATH = findMatrix();

// Compare on meaning, not on Markdown markup: drop the inline code/emphasis marks the Markdown uses
// for rendering and collapse whitespace. A real wording change survives this; a backtick does not.
function normalize(cell: string): string {
  return cell.replace(/[`*]/g, '').replace(/\s+/g, ' ').trim();
}

interface ParsedRow {
  id: number;
  capability: string;
  target: string;
  actual: string;
  note: string;
}

function parseMatrix(markdown: string): ParsedRow[] {
  return (
    markdown
      .split('\n')
      // Capability-matrix rows are the only pipe-table rows that start with `| <number> |`; the truth
      // taxonomy table above starts with a level name, so it is not matched.
      .filter((line) => /^\|\s*\d+\s*\|/.test(line))
      .map((line) => {
        const cells = line.split('|').slice(1, -1);
        const [id, capability, target, actual, note] = cells;
        return {
          id: Number(normalize(id ?? '')),
          capability: normalize(capability ?? ''),
          target: normalize(target ?? ''),
          actual: normalize(actual ?? ''),
          note: normalize(note ?? ''),
        };
      })
  );
}

describe('capability ledger matches docs/demo-truth-matrix.md (drift guard)', () => {
  const parsed = parseMatrix(readFileSync(MATRIX_PATH, 'utf8'));

  it('parses the same number of capability rows the ledger renders', () => {
    expect(parsed.length).toBe(CAPABILITY_LEDGER.length);
  });

  it('agrees on every row: capability, target, actual and note', () => {
    const docById = new Map(parsed.map((r) => [r.id, r]));
    for (const row of CAPABILITY_LEDGER) {
      const doc = docById.get(row.id);
      expect(doc, `matrix has no row ${String(row.id)}`).toBeDefined();
      if (doc === undefined) continue;
      expect(doc.capability, `row ${String(row.id)} capability`).toBe(normalize(row.capability));
      expect(doc.target, `row ${String(row.id)} target`).toBe(row.target);
      expect(doc.actual, `row ${String(row.id)} actual`).toBe(row.actual);
      expect(doc.note, `row ${String(row.id)} note`).toBe(normalize(row.note));
    }
  });
});
