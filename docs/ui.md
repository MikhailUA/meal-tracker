# UI Coding Standards

## Core rule

**Only shadcn/ui components are used for the UI in this project. Do not create custom UI components. No exceptions.**

This means no hand-built buttons, cards, inputs, dialogs, badges, layout widgets, or any other reusable UI element. If the UI needs something, use a shadcn/ui component.

## Adding components

- Install components with the CLI: `npx shadcn@latest add <component>`.
- Installed components live in `src/components/ui/` and are imported via the `@/components/ui/*` alias (see `components.json`).
- Files in `src/components/ui/` come from the shadcn CLI only. Do not write new files there by hand, and do not modify the generated components.
- If a needed component seems to be missing, check the shadcn/ui catalog and install the right one. Do not build a substitute.

## Composition

- Build pages by composing shadcn/ui components directly in route files under `src/app/` (`page.tsx`, `layout.tsx`, etc.).
- Do not create wrapper, abstraction, or "app-specific" components around shadcn primitives (for example, a `MealCard` or `PrimaryButton`). Compose the primitives (`Card`, `CardHeader`, `Button`, ...) in place.
- Plain structural HTML elements (`div`, `main`, `section`, `ul`) may be used for layout only.

## Styling

- Use Tailwind CSS utility classes, passed via `className`, for layout and spacing.
- Use the theme's CSS variables and tokens defined in `src/app/globals.css`. Do not hard-code colors.
- Use shadcn component `variant` and `size` props instead of restyling components.
- No inline `style` attributes, no custom CSS classes for components, and no other UI or component libraries.

## Icons

- Use `lucide-react` (the configured `iconLibrary`).

## Forms, feedback, and accessibility

- Build forms with shadcn form-related components (`Input`, `Label`, `Select`, `Checkbox`, etc.).
- Show feedback and status with shadcn components (for example `Sonner`, `Alert`, `Dialog`).
- Always keep labels and accessibility attributes. Do not remove the built-in behavior of shadcn components.

## Third-party auth UI

Clerk's prebuilt components (`SignIn`, `SignUp`, `UserButton`, ...) are not shadcn components. If they are used, keep them as-is and place them using shadcn components and Tailwind layout classes. Do not build custom replacements.

## Review checklist

- [ ] Every UI element comes from `@/components/ui/*` (or is a plain structural element).
- [ ] No new file defines a UI component outside the shadcn CLI output.
- [ ] No wrapper components around shadcn primitives.
- [ ] Styling uses Tailwind utilities and theme tokens only.
- [ ] Icons come from `lucide-react`.
