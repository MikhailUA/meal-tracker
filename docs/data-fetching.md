# Data Fetching Standards

## Core rules

1. **All data fetching is done in Server Components. No exceptions.**
2. **Never create route handlers (`route.ts`) to fetch data. Under absolutely no circumstances.**
3. **All database queries go through helper functions in the `/data` directory** (`src/data/`, imported via `@/data/*`).
4. **Helpers use Drizzle ORM. Do NOT use raw SQL.**
5. **A logged-in user may only access their own data. Never expose another user's data.**

## Server Components only

- Fetch data directly in async Server Components (`page.tsx`, `layout.tsx`, or server components they render) by calling `/data` helpers.
- Do not fetch data in Client Components (`"use client"`): no `useEffect` fetching, SWR, React Query, or similar.
- Do not create API routes / route handlers to serve data to the UI. If a component needs data, fetch it in a Server Component and pass it down as props.
- Check `node_modules/next/dist/docs` for current Next.js data-fetching APIs before relying on remembered ones.

## Helper functions in `/data`

- Every database query lives in a helper function in `src/data/`, grouped by domain (for example `src/data/meals.ts`).
- Server Components call these helpers. They never query the database directly, and never import `db` from `@/db` outside `src/data/`.
- Helpers are small, named for what they return (for example `getMealsForDate`), and return typed results.

## Drizzle ORM only

- Use Drizzle ORM (`db` from `@/db`, tables from `src/db/schema.ts`) for every query.
- **Do not use raw SQL**: no `db.execute(sql...)`, no hand-written query strings. Use the Drizzle query builder (`db.select()`, `db.insert()`, `db.update()`, `db.delete()`) or relational queries (`db.query.*`) with operators such as `eq`, `and`, `gte`.

## User data isolation

A logged-in user must only ever read or modify their own data.

- Get the current user inside the helper from Clerk's server-side `auth()` (`userId`). **Never accept a user ID from the client, URL, search params, or props** as the source of truth.
- If there is no `userId`, do not query. Throw or redirect to sign-in.
- **Every query is scoped to the current user**, e.g. `where(eq(meals.userId, userId))`.
- Queries by record ID must also include the user condition, e.g. `and(eq(meals.id, id), eq(meals.userId, userId))`. This applies to reads, updates, and deletes. An ID alone is never enough.
- Never return unscoped queries (for example, selecting a whole table), and never return data belonging to other users.

Example:

```ts
// src/data/meals.ts
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { meals } from "@/db/schema";

export async function getMeal(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.query.meals.findFirst({
    where: and(eq(meals.id, id), eq(meals.userId, userId)),
  });
}
```

## Review checklist

- [ ] Data is fetched only in Server Components.
- [ ] No route handlers were created to fetch data.
- [ ] Every query lives in a helper in `src/data/`, and nothing else imports `db`.
- [ ] Helpers use Drizzle ORM with no raw SQL.
- [ ] The user ID comes from Clerk `auth()`, not from client input.
- [ ] Every query (including by-ID reads, updates, deletes) is filtered by the current user's ID.
