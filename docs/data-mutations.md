# Data Mutations Standards

## Core rules

1. **All data mutations (insert, update, delete) go through helper functions in `src/data/`.**
2. **Helpers wrap Drizzle ORM calls. Do NOT use raw SQL.**
3. **Mutations are triggered only via Server Actions**, defined in co-located files named `actions.ts`.
4. **Every Server Action parameter has an explicit TypeScript type. Never use `FormData`.**
5. **Every Server Action validates its arguments with Zod** before doing anything else.
6. **A logged-in user may only modify their own data** (see `docs/auth.md` and `docs/data-fetching.md`).

## Data helpers (`src/data/`)

- Every database write lives in a helper in `src/data/`, grouped by domain (for example `src/data/meals.ts`), alongside the read helpers.
- Helpers use the Drizzle query builder: `db.insert()`, `db.update()`, `db.delete()`. No `db.execute(sql...)` or hand-written query strings.
- Never import `db` from `@/db` outside `src/data/`. Server Actions never write to the database directly.
- Helpers are small and named for what they do (for example `createMeal`, `updateMeal`, `deleteMeal`) and return typed results.
- Helpers get the current user from Clerk's `auth()` and never accept a user ID as a parameter. If there is no `userId`, throw.
- Updates and deletes by record ID must also filter by the current user: `and(eq(meals.id, id), eq(meals.userId, userId))`. An ID alone is never enough.
- Inserts set `userId` from `auth()`, never from caller input.

```ts
// src/data/meals.ts
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { meals } from "@/db/schema";

export async function deleteMeal(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(meals).where(and(eq(meals.id, id), eq(meals.userId, userId)));
}
```

## Server Actions

- Mutations happen **only** through Server Actions. No route handlers (`route.ts`) for mutations, and no mutating from Client Components in any other way.
- Put actions in a file named **`actions.ts`**, co-located with the route or component that uses them (for example `src/app/dashboard/actions.ts`).
- Start the file with `"use server"`.
- Actions call helpers from `src/data/`. They contain no database code.
- Actions are typed functions that take plain, typed arguments (objects, strings, numbers, and so on).
- **Do not use `FormData`** as a parameter type, and do not read values with `formData.get(...)`. Call actions from Client Components with typed values, for example from an event handler or `useTransition`.
- Every parameter has an explicit TypeScript type. No implicit `any`, and no `unknown` left unvalidated.
- After a successful mutation, refresh affected data with `revalidatePath` / `revalidateTag` from `next/cache` as needed. Check `node_modules/next/dist/docs` for current APIs before relying on remembered ones.

## Zod validation

- **Every Server Action validates all of its arguments with Zod** before calling any helper. Server Actions are public endpoints, so TypeScript types alone are not enough.
- Define a Zod schema for each action's input, and derive the parameter type from it with `z.infer`.
- Use `schema.parse(...)` (throws on invalid input) or `schema.safeParse(...)` (return a typed error result). Never skip validation or cast input.
- Validate dates, IDs, and numbers with the appropriate Zod types (for example `z.coerce.date()` is not needed when you pass a `Date`; use `z.date()`), and set sensible limits (`.min()`, `.max()`, `.positive()`).
- Zod is the validation library for the whole app. Do not mix in others.

```ts
// src/app/dashboard/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteMeal } from "@/data/meals";

const deleteMealSchema = z.object({
  id: z.number().int().positive(),
});

export async function deleteMealAction(params: z.infer<typeof deleteMealSchema>) {
  const { id } = deleteMealSchema.parse(params);

  await deleteMeal(id);
  revalidatePath("/dashboard");
}
```

## Do not

- Do not mutate data in Server Components, Client Components, or route handlers.
- Do not accept `FormData` in a Server Action.
- Do not write to the database from an action. Always go through a `src/data/` helper.
- Do not trust a user ID passed in from the client.
- Do not use raw SQL.

## Review checklist

- [ ] Every write is in a `src/data/` helper that uses Drizzle (no raw SQL).
- [ ] The mutation is triggered by a Server Action in a co-located `actions.ts` file.
- [ ] Action parameters have explicit TypeScript types and none is `FormData`.
- [ ] The action validates its arguments with Zod before calling a helper.
- [ ] The helper takes the user ID from Clerk `auth()`, and updates/deletes filter by it.
- [ ] Affected paths or tags are revalidated after the mutation.
