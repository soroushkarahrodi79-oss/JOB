# Dependency Budget and Supply-Chain Posture

> **Canonical for:** the justification of every direct dependency, and the GATE 2 supply-chain
> resilience posture (D15).
> **Not canonical for:** the accepted stack (see [ADR-0008](../adr/0008-provisional-application-stack.md))
> or the open decision itself (see [../open-decisions.md](../open-decisions.md) D15).
> **Status:** Draft. Introduced at GATE 2.

[ADR-0008](../adr/0008-provisional-application-stack.md) requires that each direct dependency be
justified, "because every one enlarges this surface." This document is that justification. Adding a
direct dependency means adding a row here with its reason.

## Supply-chain resilience (D15)

- **Committed lockfile.** `pnpm-lock.yaml` is committed and pins exact versions with integrity
  hashes. `.npmrc` sets `save-exact=true` so direct dependencies are pinned, not ranged.
- **Reproducible install.** CI runs `pnpm install --frozen-lockfile`; a lockfile that does not match
  `package.json` fails the build rather than silently resolving new versions.
- **No foreign CDN in the critical path.** The font is self-hosted and subset
  ([ADR-0005](../adr/0005-persian-first-rtl-native-ui.md), ADR-0008 c4); no runtime fetches a script,
  style or font from a third-party host.
- **Not solved, only mitigated.** The npm registry remains a foreign build-time dependency, and
  sanctions/export-control exposure (Q11) is unresolved. ADR-0008 says so; this document does not
  claim otherwise.

## Direct dependencies

Grouped by the purpose that earns each its place. All are dev/build-time except the app runtime row.

### Application runtime (apps/web)

| Package | Purpose | Portability note |
| --- | --- | --- |
| `next` | The accepted application framework (ADR-0008). | `output: standalone` runs on generic Node/Docker; no platform SDK, no edge-only APIs (ADR-0008 c2/c3). |
| `react`, `react-dom` | The accepted UI runtime (ADR-0008). | Framework-agnostic; the domain and tokens never import them. |

### Language and types

| Package | Purpose |
| --- | --- |
| `typescript` | Strict TypeScript — the accepted language (ADR-0008). |
| `@types/node`, `@types/react`, `@types/react-dom` | Type definitions for the above. |

### Linting and formatting (enforcement of accepted ADRs)

| Package | Purpose |
| --- | --- |
| `eslint`, `@eslint/js`, `typescript-eslint`, `globals` | ESLint core + TS support. Carries the ADR-0002 dependency-direction boundary and the ADR-0005 no-physical-`left`/`right` rule. |
| `eslint-plugin-react-hooks` | Correct hook usage in the app and primitives. |
| `@next/eslint-plugin-next` | Next.js app lint rules. |
| `eslint-config-prettier` | Disables stylistic ESLint rules that would fight Prettier. |
| `stylelint`, `stylelint-config-standard` | CSS lint; carries the ADR-0005 logical-properties rule. Physical `left`/`right` is rejected with core rules — no extra plugin. |
| `prettier` | Formatting. Canonical docs are excluded so they are not reflowed. |

### Testing

| Package | Purpose |
| --- | --- |
| `vitest` | Unit and component test runner (accepted stack). |
| `vite-node` | Runs the TypeScript token-CSS generator with no separate build step; ships with Vitest's toolchain, pinned as a direct dependency so its bin is linked. |
| `jsdom` | DOM environment for component tests. |
| `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom` | Rendering and assertions for the primitives' accessibility semantics. |
| `@playwright/test` | Browser test runner (accepted stack) for the rendered R1–R5 checks. |
| `@axe-core/playwright` | Minimal automated accessibility integration. Automated checks are necessary, not sufficient. |

## Deliberately deferred (accepted, not yet installed)

Part of the ADR-0008 stack, but with no purpose at GATE 2. Installing them now would be dependency
surface with no current need (CLAUDE.md §5). Each arrives at the gate that uses it.

| Package | Deferred to | Why |
| --- | --- | --- |
| `tailwindcss` (+ postcss) | GATE 4 (screens) | GATE 2 builds the token layer and primitives from tokens; the utility layer earns its place when many screens are built, and it must consume the tokens rather than impose a palette. |
| `drizzle-orm`, `drizzle-kit` | GATE 3 | Schema authoring is deferred to GATE 3 by ADR-0008 c6; the domain exists first. |
| A PostgreSQL client | GATE 3 | No persistence yet. |
| `zod` | GATE 3 | Validates at boundaries; there are no boundaries to validate until the application layer exists. |

## Fonts (not an npm dependency)

Vazirmatn (D19) is vendored as subset `woff2` files under `apps/web/public/fonts`, with `OFL.txt`
alongside as the SIL OFL 1.1 licence requires. Total payload **95 KB**, within the ≤ 200 KB budget
([typography.md](../design/typography.md)). It is not fetched from a registry or CDN at build or
runtime.
