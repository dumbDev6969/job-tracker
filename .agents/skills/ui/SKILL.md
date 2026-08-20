---
name: ui
description: Use when building or editing any React UI in this project — components, pages, forms, charts, layouts. Enforces responsive design, dark/light theme correctness, and shadcn/ui consistency. Load before writing JSX/TSX or Tailwind classes.

Frontend UI

You are building UI for a shadcn/ui (Base UI + Nova preset) + Tailwind + React/TS project. Every screen must work at every breakpoint and in both themes without a follow-up pass. Treat these as requirements, not preferences.

1. Component sourcing order

Before writing custom markup, check in this order:

Already installed in src/components/ui/? Use it as-is. Don't rebuild a Button, Card, Dialog, etc. that already exists.
Available in shadcn's registry but not yet installed? Say so and ask before running npx shadcn add <component> — don't silently add new dependencies.
Only if neither applies: compose from existing primitives (e.g. a stat card = Card + CardHeader + CardContent, not a new one-off div tree).

Never hand-roll a component that shadcn already provides (dropdown, tooltip, dialog, tabs, etc.), even if it "would only take a few lines."

2. Theme correctness (non-negotiable)
Never hardcode colors. No text-black, bg-white, border-gray-200, #fff, etc. Always use the semantic tokens: bg-background, text-foreground, bg-muted, text-muted-foreground, border-border, bg-card, text-card-foreground, bg-primary, text-primary-foreground, bg-destructive, etc.
If a color isn't covered by an existing token, don't invent an ad-hoc hex value — extend tailwind.config / CSS variables so both :root and .dark get a value, then use the token.
Every custom SVG icon, chart color, or illustration needs a light AND dark value. Recharts series colors especially — pull from CSS variables (var(--chart-1) etc.), not fixed hex codes, or they'll look wrong in one theme.
Before considering a component done, mentally (or actually) toggle both themes and check: borders visible in both, text contrast readable in both, hover/focus states visible in both.
3. Responsive requirements
Design mobile-first: base classes are the smallest viewport, then layer sm: md: lg: xl: up.
Every layout must be checked at minimum: 375px (mobile), 768px (tablet), 1280px+ (desktop). If you can't visually verify, reason through each breakpoint explicitly before finishing.
Tables/data-dense views (e.g. the job applications list) need a real mobile strategy — don't just shrink a table. Use a card-list layout below md:, or horizontal scroll with a visible affordance, not silent overflow.
Touch targets on mobile: minimum ~40px hit area for buttons/icons, even if the visual icon is smaller.
No fixed pixel widths on containers that should flex. Use max-w-*, w-full, flex, grid with responsive column counts instead of hardcoded widths.
4. Consistency rules
Spacing, radius, and shadow all come from the existing design tokens/Tailwind config — don't introduce a one-off rounded-[14px] or shadow-[0_2px_8px_rgba(...)] next to shadcn defaults (rounded-md, rounded-lg, shadow-sm).
Reuse existing patterns in the codebase before inventing a new one — if there's already a card style for one feature, match it for the next rather than styling similar content differently.
Icon set stays consistent (check what's already used — likely lucide-react, matching your other Anthropic-tooling components) — don't mix icon libraries.
Form fields, buttons, and empty/error states should look and behave the same way across every feature (applications, auth, analytics) — same label style, same error text placement, same button sizing.
5. Before finishing any UI task

Run through this checklist and fix anything that fails, don't just report it:

 No hardcoded colors — only semantic tokens
 Works at mobile, tablet, and desktop widths
 Looks correct in both light and dark mode
 Reuses existing shadcn components instead of custom ones
 Matches spacing/radius/shadow conventions already in the codebase
 Keyboard focus states are visible (shadcn gives you this for free — don't override outline-none without a replacement focus ring)
---

<!-- Tip: Use /create-skill in chat to generate content with agent assistance -->
