# Bombay Heritage — React Port Design

**Date:** 2026-07-26
**Status:** Approved for planning

## Goal

Convert the single-file static site at `index.html` (1881 lines) into a structured
React application. The rendered page must look and behave identically — same
layout, same colours, same animations, same copy. This is a technology port, not
a redesign.

Nothing about the product changes: cart, login/signup, and checkout stay
front-end-only demos with no backend, exactly as PRODUCT.md describes.

## Decisions

| Axis | Decision |
|------|----------|
| Framework | Vite + React 19 + TypeScript |
| Styling | Tailwind v4 via `@tailwindcss/vite`, brand colours as `@theme` tokens |
| Animation | Port as-is; GSAP + ScrollTrigger kept as npm dependencies |
| Deployment | React app replaces the root page; Pages workflow builds and deploys `dist/` |
| Original file | Preserved at `legacy/index.html` as a permanent visual reference, excluded from the build |

No router. The page keeps its anchor navigation (`#home`, `#menu`, `#specials`,
`#about`, `#contact`), which `scroll-smooth` on `<html>` already handles.

No state library. Two React contexts cover everything.

## Architecture

### Data layer — `src/data/menu.ts`

`MENU_CATEGORIES` (4 entries) and `MENU_ITEMS` (10 entries) move out of the
inline script unchanged, gaining a `MenuItem` type:

```ts
type MenuItem = {
  id: string;
  name: string;
  category: "starters" | "mains" | "breads" | "desserts";
  veg: boolean;
  signature: boolean;
  price: number;
  desc: string;
  img: string;
};
```

`SPECIALS` stays a derived `MENU_ITEMS.filter(i => i.signature)` — currently 4 dishes.

### State layer

**`CartProvider`** owns:
- `items: Record<string, number>` — dish id to quantity
- `addToCart(item, imgEl)` — increments; on the first add of a dish, triggers the
  fly-to-cart flight and the toast
- `changeQty(id, delta)` — deletes the entry at zero
- derived `count` and `subtotal`
- `badgeHeld` — suppresses the badge count until an in-flight animation lands
- `cartButtonRef` — registered by `Navbar`, read by the flight animation

**`UIProvider`** owns:
- `cartOpen: boolean`
- `authMode: "login" | "signup" | null` (null means closed)
- `mobileMenuOpen: boolean`
- `toast: string | null` plus `showToast(message)` with the existing 3000ms auto-dismiss

### View layer

```
src/
├─ main.tsx
├─ App.tsx                    providers + section composition + global key handling
├─ index.css                  Tailwind import, @theme tokens, ported keyframes
├─ data/menu.ts
├─ lib/money.ts               money(n) => "$" + n.toFixed(2)
├─ context/
│  ├─ CartContext.tsx
│  └─ UIContext.tsx
├─ hooks/
│  ├─ useScrollReveal.ts      GSAP fade-up, replaces [data-reveal]
│  ├─ useAboutUncover.ts      ScrollTrigger adds .is-uncovering once
│  ├─ useFlyToCart.ts         WAAPI arc, ported verbatim
│  ├─ useBodyScrollLock.ts    refcounted across drawer + modal
│  └─ useFocusTrap.ts         Tab cycling and Escape-to-close
└─ components/
   ├─ layout/    Navbar.tsx, MobileMenu.tsx, Footer.tsx
   ├─ sections/  Hero.tsx, Specials.tsx, Menu.tsx, About.tsx, Contact.tsx
   ├─ dish/      DishCard.tsx, CartControl.tsx
   ├─ cart/      CartDrawer.tsx
   ├─ auth/      AuthModal.tsx
   └─ ui/        Reveal.tsx, RevealWords.tsx, GradientBorder.tsx, Toast.tsx, Icon.tsx
```

### What the port deletes

The current script maintains DOM consistency by hand. Three mechanisms disappear
entirely because React's rendering model covers them:

- `syncCartControls()` — walks every `[data-ctl]` node after each change so a dish
  appearing in both the specials rail and the menu grid shows the same quantity.
  In React each `DishCard` reads its own quantity from context.
- `renderSpecials()` / `renderMenuTabs()` / `renderMenuGrid()` / `renderCart()` —
  template-string builders writing to `innerHTML`. Replaced by JSX.
- The `id`-based lookups (`document.getElementById("cart-total")` and ~20 similar)
  — replaced by props and context.

The `id` attributes on sections (`#home`, `#menu`, `#specials`, `#about`,
`#contact`) stay, because anchor navigation depends on them.

## Styling

### Token layer

Brand colours, currently repeated as arbitrary Tailwind values across roughly 80
sites, are declared once in `index.css`:

```css
@theme {
  --color-heritage: #8B3A2E;
  --color-heritage-deep: #5E2318;
  --color-saffron: #C6973F;
  --color-saffron-light: #E8C87E;
  --color-cacao: #3A1509;
  --color-surface: #FAF6EF;
  --color-veg: #3E8E5A;
  --font-display: "Fraunces", serif;
  --font-body: "Inter", sans-serif;
}
```

Mapping applied across `src/`:

| Before | After |
|--------|-------|
| `bg-[#8B3A2E]`, `text-[#8B3A2E]`, `bg-[#8B3A2E]/10` | `bg-heritage`, `text-heritage`, `bg-heritage/10` |
| `text-[#5E2318]` | `text-heritage-deep` |
| `text-[#C6973F]` | `text-saffron` |
| `text-[#E8C87E]` | `text-saffron-light` |
| `text-[#3A1509]` | `text-cacao` |
| `bg-[#FAF6EF]`, `text-[#FAF6EF]` | `bg-surface`, `text-surface` |
| `style="font-family:'Fraunces',serif;font-weight:500"` | `font-display font-medium` |

### Scope limits

Two things deliberately stay as they are:

- **One-off gradient stops keep their raw values inline.** The hero scrim
  (`rgba(24,10,6,.88)` to transparent), the `#F4EDE1 → #FAF6EF` section washes,
  the footer's `#231008`, and the seven gradient-border recipes are each used
  once or twice in a single context. Naming them would add indirection without
  a payoff.
- **Tailwind's `stone-*` scale is untouched.** Body copy uses `text-stone-500`,
  `text-stone-800`, `text-stone-300` and similar throughout. These are stock
  Tailwind values that carry over to v4 unchanged.

### Sequencing

The rename happens as a **second pass**, after the markup port is confirmed
visually identical:

1. Port all markup with classes copied verbatim — `bg-[#8B3A2E]` stays
   `bg-[#8B3A2E]`. Build, then compare against `legacy/index.html`.
2. Apply the token mapping as a mechanical find-and-replace. Build again.

If anything drifts visually, this isolates whether the cause was the React
restructuring or the rename.

### Ported CSS

The `<style>` block moves to `index.css` unchanged: `about-uncover`,
`about-settle`, `qty-roll`, `badge-pop`, and `cart-catch` keyframes; the
`.cart-ctl` grid-stack morph; `.brand-lockup` and `.hero-title` (including the
`clamp(2rem, 12vw, 4.5rem)` fluid sizing); and both
`prefers-reduced-motion: reduce` guards.

Selectors keyed to element ids (`#cart-badge.is-pop`, `#cart-btn.is-catching`)
are rewritten as class selectors (`.cart-badge.is-pop`) so they do not depend on
a single element instance.

## Component notes

### GradientBorder

The `p-px` wrapper with a linear-gradient background and a rounded inner surface
appears seven times with varying gradients, radii, and inner backgrounds: hero
info strip, about image, three about stat cards, contact info card, contact map,
cart drawer, newsletter input. One component with `gradient`, `radius`, and
`className` props removes the duplication while producing identical markup.

### DishCard and CartControl

`DishCard` renders the image, the signature badge, the veg/non-veg dot, name,
description, price, and `CartControl`.

`CartControl` is the pill whose face swaps between "Add" and a quantity stepper.
Both faces occupy the same grid cell so the swap reads as a morph. Behaviour
preserved exactly:

- `is-qty` class toggles which face is visible
- `is-arming` disables the stepper for 340ms after the first add, so the tail of
  a double-click cannot land on "−"
- `is-rolling` replays the digit roll animation on every quantity change

The current code forces a reflow (`void num.offsetWidth`) to restart the
animation. In React the equivalent is a `key` on the quantity span that changes
with the value, remounting the node and restarting the animation naturally.

### Fly-to-cart

The most intricate piece. It measures the dish image and the navbar cart button
with `getBoundingClientRect`, then puts horizontal travel on an outer node and
vertical travel on an inner one so the two easings compose into an arc rather
than a straight diagonal. 620ms, with the inner element also morphing
`border-radius` from `24px` to `50%` and fading to `0.2` opacity.

React needs refs at both ends: `Navbar` registers `cartButtonRef` into
`CartContext`; `DishCard` passes its image ref into `addToCart`. The animation
body is copied verbatim.

Existing guards preserved: no flight under `prefers-reduced-motion`, no flight if
`Element.prototype.animate` is missing, no flight if either rect has zero width.
When a flight runs, `badgeHeld` suppresses the count until it lands, then the
cart button plays `cart-catch`.

### RevealWords

`[data-reveal-words]` currently reads `textContent`, collapses whitespace, and
rewrites `innerHTML` as one `<span>` per word before GSAP staggers them. Used on
four headlines: the hero title and the Specials, Menu, and Contact section
headings.

As a React component, the split happens at render time — the component takes a
string child, splits on `/\s+/`, and emits the spans as JSX. GSAP then animates
the rendered spans. No DOM mutation, and it survives re-render.

### Overlays

`CartDrawer` and `AuthModal` both need scroll locking and focus trapping. The
current implementation uses a global `keydown` listener that inspects class names
to decide which overlay is open, plus an `openOverlayCount` refcount so closing
one overlay does not unlock scrolling while the other is still open.

Refactored into two hooks. `useBodyScrollLock(isOpen)` keeps the refcount
semantics via a module-level counter. `useFocusTrap(ref, isOpen, onClose)` handles
Tab cycling within the container and Escape-to-close, attaching only while open.

Preserved behaviours: focus moves to the drawer's close button on open and to the
email field on auth open; the previously focused element is restored on close;
the drawer animates via `translate-x-full` over 300ms with the overlay fading
over the same duration.

### Icons

The `<iconify-icon>` web component (loaded from a CDN, resolving each icon over
the network at runtime) becomes `@iconify/react` with `@iconify-json/solar`
installed as a dependency, so icons are bundled. Same Solar linear set, same
glyph names, same `width` and `stroke-width` values. A thin `Icon` wrapper keeps
call sites terse.

## Build and deployment

- `vite.config.ts` sets `base: "./"` so relative asset paths resolve on a GitHub
  Pages project URL.
- The current `index.html` is copied to `legacy/index.html` first, then the root
  file is overwritten with the Vite entry: `<div id="root">`, the title, the
  viewport meta, and the Google Fonts links for Fraunces and Inter. Fonts stay on
  the Google CDN, matching current behaviour.
- `legacy/` is excluded from the build via `vite.config.ts` and carries a README
  explaining it is a reference copy, kept in the repo permanently.
- `.gitignore` gains `node_modules/` and `dist/`.
- `.github/workflows/static.yml` gains `actions/setup-node` with npm caching,
  `npm ci`, and `npm run build`, and uploads `dist/` instead of `.`.

## Verification

Because "looks the same" is the requirement, verification is the substance of
this work, not a formality.

**Automated:**
- `tsc --noEmit` passes with no errors.
- `npm run build` completes without warnings about unresolved imports or assets.
- Vitest unit tests on cart logic — the only non-visual logic in the app:
  - adding a new dish creates a line at quantity 1
  - adding an existing dish increments it
  - decrementing to zero removes the line entirely
  - subtotal is correct across mixed quantities and prices
  - `money()` formats to two decimals

**Manual, against `legacy/index.html` side by side** at 375px, 768px, and 1440px:
- All seven sections match in layout, spacing, colour, and copy.
- Menu category filtering shows the right dishes and the right count note.
- Add-to-cart plays the flight arc; the badge holds, then pops; the cart button
  dips.
- The Add pill morphs to a stepper; the digit rolls on change; the stepper is
  inert for the first 340ms.
- A dish added from the specials rail shows the same quantity in the menu grid.
- Cart drawer and auth modal: open, close, Escape, focus trap, scroll lock.
- Auth modal toggles between login and signup, showing and hiding the name field.
- Scroll reveals fire for section headings, the word stagger runs on the four
  headline elements, and the About section uncovers with its clip-path sweep.
- Toasts appear for add-to-cart, checkout, auth submit, and newsletter submit.
- With `prefers-reduced-motion: reduce` set, animations are suppressed and all
  content remains visible.

## Out of scope

- Any backend, real authentication, real payment, or order persistence.
- Cart persistence across reloads — the current page does not do this.
- Content changes. All placeholder copy, stock imagery, and sample stats carry
  over verbatim; PRODUCT.md notes they are filler, but replacing them is separate
  work.
- Accessibility or performance improvements beyond preserving what exists.
- Responsive behaviour changes.
