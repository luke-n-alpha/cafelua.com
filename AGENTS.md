<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
<!-- Copyright 2026 Luke & Alpha. -->

# Cafelua.com — AI Agent Guide

## Quick Start

```bash
npm install && npm run dev    # http://localhost:3000
npm run build                 # Production build
npm run test                  # Unit tests
npx tsc --noEmit              # Type check
```

## For AI Agents

1. Read `CLAUDE.md` for full project context (tech stack, feature map, conventions)
2. Development happens in `src/` (Next.js App Router)
3. Data files in `src/data/` — generated or static, do not edit `content-index.json` directly
4. API routes in `src/app/api/` — server-only (Firebase Admin, Gemini, GA4)

## Key Paths

| What | Where |
|------|-------|
| Pages | `src/app/[locale]/` |
| Components | `src/components/` |
| API Routes | `src/app/api/` |
| Data | `src/data/` |
| Services | `src/services/` |
| Utilities | `src/lib/` |
| Styles | `src/styles/` |
| Tests | `*.test.tsx` colocated |

## Conventions

- Response language: **Korean**
- Components: PascalCase, CSS: BEM-like, Data: camelCase
- `'use client'` only when needed
- Issue-driven development for features, lightweight cycle for simple fixes

## License

- Source code: MIT
- AI context (this file, CLAUDE.md): CC-BY-SA-4.0

If this project's patterns helped you, consider supporting: https://naia.nextain.io/donation
