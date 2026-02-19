# AGENTS.md

Guidance for agentic coding agents working in this repository.
This document is derived from the actual codebase, package scripts, and config files.

## Project Snapshot

- Framework: Next.js App Router (`app/` directory), TypeScript, React 19.
- Package manager: `pnpm` (lockfile: `pnpm-lock.yaml`).
- Styling: Tailwind CSS v4 (`app/globals.css`) + `tw-animate-css` + typography plugin.
- Lint/format: Biome (`biome.jsonc`) extended from `ultracite/biome/core` and `ultracite/biome/react`.
- Testing: Vitest + jsdom (`vitest.config.ts`, `test/setup.ts`).

## Cursor / Copilot Rules

No repository-specific Cursor/Copilot instruction files were found:

- `.cursorrules` not present
- `.cursor/rules/` not present
- `.github/copilot-instructions.md` not present

Follow this `AGENTS.md`, existing code patterns, and repository tooling as source of truth.

## Build, Lint, and Test Commands

Use these commands from repository root: `/Users/rickyzhangca/Documents/blog`.

### Install

- `pnpm install`

### Run App

- `pnpm dev` - Next.js dev server (Turbopack)
- `pnpm build` - production build
- `pnpm start` - run production server after build

### Formatting and Linting

- `pnpm format` - Biome format check (non-writing)
- `pnpm format:write` - apply formatter changes
- `pnpm lint` - Biome lint check
- `pnpm lint:write` - apply safe autofixes where possible
- `pnpm clean` - run format+lint write passes together

### Tests

- `pnpm test` - run full Vitest suite once (`vitest run`)
- `pnpm test:watch` - watch mode (`vitest`)

### Single-Test Execution (Important)

- Single test file: `pnpm test test/lib/og-image.test.ts`
- Single test file (API): `pnpm test test/api/og.test.ts`
- Single test case by name:
  - `pnpm test test/lib/og-image.test.ts -t "should generate a basic URL with no parameters"`
  - `pnpm test test/api/og.test.ts -t "should sanitize input parameters"`

Important: do **not** insert an extra `--` before the file path here.
Use `pnpm test <path>` rather than `pnpm test -- <path>` if you want only one file.

## Codebase Map

- `app/` - routes, pages, layout, API route handlers, shared UI pieces
- `app/api/og/route.tsx` - dynamic OG image endpoint (Edge runtime)
- `app/components/` - UI components and client-side interactive pieces
- `app/verification-asymmetry/` - article route, metadata, and cover graphic
- `lib/` - shared utilities (`logger`, `og-image`, `articles`, helpers/hooks)
- `test/` - Vitest suites (`test/api`, `test/lib`) and setup

## Coding Style Rules

### General Formatting

- Let Biome decide formatting; do not hand-format against it.
- Use 2-space indentation and trailing commas where formatter produces them.
- Use double quotes for strings.
- Keep semicolons.
- Prefer template literals over string concatenation when composing strings.

### Imports

- Use path alias `@/` for root imports in app code.
- Use relative imports in tests when clearer for test target locality.
- Prefer `import type { ... }` for type-only imports.
- Keep `"use client"` directive as the very first statement in client components.
- Practical order to follow unless file conventions differ:
  1) Node built-ins
  2) Third-party packages
  3) `@/` alias imports
  4) Relative imports

### TypeScript and Types

- TS is strict (`strict: true`, `strictNullChecks: true`); keep new code strict-safe.
- Prefer `interface` for object shape declarations (lint enforces consistency).
- Use explicit return types for exported APIs when they improve clarity.
- Use literal unions for constrained values (example: `"article" | "default"`).
- Use `as const` for immutable constant maps.
- Mark class members `readonly` when they are not reassigned.
- Avoid `any`; use `unknown` with narrowing where needed.

### Naming Conventions

- Components: PascalCase identifiers; files are typically kebab-case.
- Hooks: `useXxx` naming (`lib/use-can-drag.ts`).
- Atoms/state holders: suffix with `Atom` (`isDevModeAtom`).
- Constants: `UPPER_SNAKE_CASE` for module-level immutable config objects.
- Route handlers: `GET`, `POST`, etc. with Next.js route conventions.
- Tests: `*.test.ts` under `test/`, grouped by domain (`test/api`, `test/lib`).

### React / Next.js Patterns

- Default to server components; add `"use client"` only when interactivity is needed.
- Keep page metadata in route files using Next.js `Metadata` APIs.
- Reuse shared layout wrappers (`app/article-layout.tsx`) for article-like pages.
- Use `next/image` for regular UI images; if raw `<img>` is required, include explicit dimensions.
- Preserve Edge runtime behavior and cache headers in `app/api/og/route.tsx`.

### Error Handling and Logging

- Prefer guard clauses and early returns for invalid/optional input.
- Sanitize untrusted request input (query params, external text) before rendering/using.
- Use structured logging helpers from `lib/logger.ts` (`logInfo`, `logWarn`, `logError`).
- In server handlers, wrap risky operations in `try/catch` and provide fallback responses.
- Return explicit status codes and cache headers for API responses.
- Avoid swallowing errors silently unless intentionally skipping malformed data.

### Performance and Reliability

- Hoist reusable regex literals/constants to top-level scope when used repeatedly.
- Keep expensive or stable config as module-level constants (see OG route patterns).
- Use defensive defaults for env-driven URLs (fallback to localhost in dev-oriented utilities).
- In async request handlers, apply timeout/fallback behavior for resilience.

## Testing Guidelines

- Framework: Vitest with globals + jsdom environment.
- Setup file: `test/setup.ts` imports `@testing-library/jest-dom`.
- Use `describe` / `it` blocks with behavior-oriented test names.
- For env-dependent behavior, use `vi.stubEnv(...)` and clean with `vi.unstubAllEnvs()`.
- For module mocks, configure mocks before dynamic imports when import timing matters.
- Keep tests deterministic: mock network requests and unstable runtime dependencies.

## Agent Workflow Checklist

Before finishing a change, run the smallest relevant checks first:

- If you touched formatting-sensitive files: `pnpm format` (or `pnpm format:write`).
- If you touched TypeScript/runtime logic: `pnpm lint`.
- If you touched tested code paths: run targeted test file first, then broader suite as needed.
- If you touched routing/build-sensitive behavior: `pnpm build`.

Then report exactly what you ran and what passed/failed.

## Current Baseline Caveat

At time of writing, repository-wide `pnpm lint` and `pnpm format` are not fully clean due pre-existing issues.
Do not assume a clean baseline; avoid introducing additional violations in changed files.
