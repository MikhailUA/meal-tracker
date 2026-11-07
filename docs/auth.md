# Authentication Standards

## Core rules

1. **All authentication is handled by [Clerk](https://clerk.com) (`@clerk/nextjs`). No exceptions.**
2. **Never build custom auth.** No hand-rolled sessions, cookies, JWTs, password handling, or other auth libraries (NextAuth, Auth.js, Lucia, etc.).
3. **Never trust a user ID from the client.** Derive the current user only from Clerk on the server via `auth()`.
4. **Every data helper that touches user data must check `userId`** and scope its query to it (see `docs/data-fetching.md`).

## Setup (already in place)

- `src/proxy.ts` runs `clerkMiddleware()` on all non-static routes and `/api` / `/trpc`. Keep it in place. Next.js 16 uses `proxy.ts`, not `middleware.ts`.
- `src/app/layout.tsx` wraps the app in `<ClerkProvider>` and renders the header with `<Show>`, `<SignInButton>`, `<SignUpButton>`, and `<UserButton>`.
- Sign-in and sign-up pages live at `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx`, rendering Clerk's `<SignIn />` / `<SignUp />`.
- Clerk keys come from environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) in `.env.local`. Never hardcode or commit them.

## Getting the current user (server)

- Import from `@clerk/nextjs/server`: `import { auth } from "@clerk/nextjs/server";`
- `auth()` is **async**. Always `await` it.
- Use `userId` (Clerk's user ID string) as the owner key stored in the database (`userId` columns).
- Use `currentUser()` only when you need profile details (name, email); prefer `auth()` otherwise since it is cheaper.

```ts
const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

## Protecting data and routes

- **Data helpers in `src/data/`** call `auth()` themselves, throw if there is no `userId`, and filter every query by that `userId`. Do not accept `userId` as a parameter from callers.
- **Protected pages** (for example `/dashboard`) must not rely on hiding UI alone. Enforce access on the server, either with `auth.protect()` / a redirect when signed out, or by relying on the data helper's check.
- Do not create route handlers to expose user data (see `docs/data-fetching.md`).

## UI

- Use Clerk's prebuilt components (`SignIn`, `SignUp`, `SignInButton`, `SignUpButton`, `UserButton`) rather than building custom auth forms.
- Conditionally render by auth state with Clerk's `<Show when="signed-in">` / `<Show when="signed-out">`.
- Use `mode="modal"` for sign-in/sign-up buttons, consistent with the existing header.
- Clerk components are the exception to the shadcn/ui-only rule in `docs/ui.md`, since they are provided by Clerk.
- Client Components may use Clerk hooks (`useUser`, `useAuth`) for display purposes only. They are never a security boundary.

## Do not

- Do not store passwords, tokens, or sessions yourself.
- Do not read `userId` from query params, request bodies, or form fields.
- Do not skip the `userId` check "because the page is protected".
- Do not log or expose Clerk secrets or session tokens.
- Do not import `@clerk/nextjs/server` in Client Components.
