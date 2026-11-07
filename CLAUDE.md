# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docs first (IMPORTANT)

**ALWAYS read the relevant file(s) in the `/docs` directory BEFORE generating any code.** The docs define the project's standards, and generated code must follow them. Do not rely on assumptions or remembered conventions when a doc covers the area.

- `docs/ui.md` — UI coding standards. Only shadcn/ui components may be used; never create custom UI components. Read this before writing or changing anything UI-related.
- `docs/data-fetching.md` — Data fetching standards. Server Components only (no route handlers for data), all queries via Drizzle helpers in `src/data/` (no raw SQL), and users may only access their own data. Read this before writing any data-fetching or database code.
- `docs/auth.md` — Authentication standards. All auth uses Clerk; get the user via `await auth()` on the server, never trust client-supplied user IDs. Read this before writing any auth-related code.
- `docs/data-mutations.md` — Data mutation standards. Writes go through Drizzle helpers in `src/data/`, triggered only by Server Actions in co-located `actions.ts` files, with explicitly typed params (no `FormData`) validated by Zod. Read this before writing any mutation code.

When adding a new doc to `/docs`, list it here.

## Project

MealTracker: a freshly bootstrapped Next.js (App Router) app, created with `create-next-app`. The app lives in this `meal-tracker/` directory; the parent `MealTracker/` directory only holds a Python `.venv` (not part of the app). Currently it is still the starter template (`src/app/page.tsx`, `layout.tsx`, `globals.css`), with no meal-tracking features, API routes, or tests yet.

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, uses `eslint-config-next`)

No test runner is configured.

## Stack notes

- Next.js 16, React 19, TypeScript (strict-style config), Tailwind CSS v4 (via `@tailwindcss/turbopack`; styles in `src/app/globals.css`).
- Source is under `src/`; the import alias `@/*` maps to `./src/*`.
- Routes use the App Router in `src/app/`. This Next.js version is newer than much training data, so check `node_modules/next/dist/docs` or the official docs before relying on remembered APIs.
