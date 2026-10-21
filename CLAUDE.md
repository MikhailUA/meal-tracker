# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
