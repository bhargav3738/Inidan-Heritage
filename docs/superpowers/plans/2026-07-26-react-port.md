# Bombay Heritage React Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the 1881-line single-file static site `index.html` into a structured Vite + React + TypeScript application that renders and behaves identically.

**Architecture:** A static SPA with no router — the page keeps its anchor navigation. Two React contexts (`UIProvider`, `CartProvider`) replace all imperative DOM state. Presentational components read context, so the hand-written DOM sync layer in the original script disappears. All animations are ported as-is: GSAP ScrollTrigger for reveals, CSS keyframes for the About uncover and cart micro-interactions, and the Web Animations API for the fly-to-cart arc.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Tailwind CSS v4 (`@tailwindcss/vite`), GSAP 3.12 + ScrollTrigger, `@iconify/react` + `@iconify-json/solar`, Vitest + React Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-07-26-react-port-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

**Source of truth.** After Task 1, the original file lives at `legacy/index.html` with the exact line numbers referenced throughout this plan. Read it directly rather than reconstructing markup from memory. Line references in tasks are to `legacy/index.html`, which is byte-identical to the pre-port `index.html`.

**Fidelity rule.** The rendered output must be pixel-identical to `legacy/index.html`. Do not "improve" markup, spacing, colour, copy, accessibility attributes, or responsive behaviour during the port. All placeholder content carries over verbatim: "Bombay Heritage", "42 Spice Lane, Old Town District, ST 10021", "(555) 123-4567", "hello@bombayheritage.com", "Est. 1987", "37+", "62", "4.9★", "© 2025 Bombay Heritage. All rights reserved.", "Crafted with cardamom & care."

**HTML-to-JSX conversion rules.** Apply these mechanically when porting markup:

| HTML | JSX |
|------|-----|
| `class="..."` | `className="..."` |
| `for="x"` | `htmlFor="x"` |
| `style="background: #231008; border: 0"` | `style={{ background: "#231008", border: 0 }}` |
| `<iconify-icon icon="solar:fire-linear" width="18" stroke-width="1.5" aria-hidden="true">` | `<Icon icon="solar:fire-linear" width={18} />` |
| `stroke-width="1.5"` | omit — `Icon` applies it |
| `onclick="openCart()"` | `onClick={openCart}` |
| `<br />`, `allowfullscreen`, `referrerpolicy` | `<br />`, `allowFullScreen`, `referrerPolicy` |
| `loading="lazy"` | `loading="lazy"` (unchanged) |
| `minlength="6"` | `minLength={6}` |
| `&quot;Fraunces&quot;` inside style | `'Fraunces', serif` in the object value |
| `'` in text (e.g. `Chef's`) | `Chef&apos;s` or `{"Chef's"}` |

**Colour classes stay verbatim until Task 17.** Write `bg-[#8B3A2E]`, `text-[#FAF6EF]`, `style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}` exactly as the original has them. The token rename is a separate, isolated pass. Do not tokenize early — it defeats the purpose of the two-pass sequencing.

**Tailwind's `stone-*` scale is never renamed.** `text-stone-500`, `text-stone-800`, `text-stone-300`, `text-stone-400`, `text-stone-600`, `border-stone-300`, `placeholder-stone-500` all stay as-is permanently.

**Commit after every task.** Use conventional-commit prefixes (`feat:`, `test:`, `chore:`, `refactor:`).

**Verification commands:**
- Type check: `npx tsc --noEmit`
- Tests: `npx vitest run`
- Build: `npm run build`
- Dev server: `npm run dev`

---

## File Structure

**Created:**

| Path | Responsibility |
|------|----------------|
| `legacy/index.html` | Untouched copy of the original, permanent visual reference |
| `legacy/README.md` | Explains why the copy exists |
| `index.html` | Vite entry — root div, title, viewport, Google Fonts links |
| `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json` | Build config |
| `src/main.tsx` | React root mount |
| `src/App.tsx` | Provider nesting + section composition |
| `src/index.css` | Tailwind import, ported keyframes, `@theme` tokens (Task 17) |
| `src/vite-env.d.ts` | Vite client types |
| `src/data/menu.ts` | `MenuItem` type, `MENU_CATEGORIES`, `MENU_ITEMS`, `SPECIALS` |
| `src/lib/money.ts` | Currency formatting |
| `src/lib/cart.ts` | Pure cart reducers — the unit-tested core |
| `src/lib/flyToCart.ts` | WAAPI arc animation |
| `src/lib/gsap.ts` | Registers ScrollTrigger once |
| `src/context/UIContext.tsx` | Drawer/modal/menu open state, toast queue |
| `src/context/CartContext.tsx` | Cart state, flight orchestration, cart button ref |
| `src/hooks/useReveal.ts` | GSAP fade-up ref, replaces `[data-reveal]` |
| `src/hooks/useAboutUncover.ts` | ScrollTrigger adds `.is-uncovering` once |
| `src/hooks/useBodyScrollLock.ts` | Refcounted scroll lock |
| `src/hooks/useFocusTrap.ts` | Tab cycling + Escape |
| `src/components/ui/Icon.tsx` | Iconify wrapper with default stroke width |
| `src/components/ui/GradientBorder.tsx` | The `p-px` gradient shell used 7× |
| `src/components/ui/RevealWords.tsx` | Per-word stagger headline |
| `src/components/ui/Toast.tsx` | Bottom-centre toast |
| `src/components/layout/Navbar.tsx` | Fixed header, cart button, mobile menu |
| `src/components/sections/Hero.tsx` | Hero + info strip |
| `src/components/sections/Specials.tsx` | Chef's Specials rail |
| `src/components/sections/Menu.tsx` | Category tabs + dish grid |
| `src/components/sections/About.tsx` | Story + stat cards |
| `src/components/sections/Contact.tsx` | Info card + map |
| `src/components/layout/Footer.tsx` | Footer + newsletter |
| `src/components/dish/CartControl.tsx` | Add ↔ stepper morph pill |
| `src/components/dish/DishCard.tsx` | Dish card |
| `src/components/cart/CartDrawer.tsx` | Overlay + slide-in drawer |
| `src/components/auth/AuthModal.tsx` | Full-screen login/signup |
| `src/test/setup.ts` | Testing Library cleanup |

**Modified:** `.github/workflows/static.yml` (Task 18), `.gitignore` (Task 1)

**Deleted:** none — the original `index.html` is overwritten in place after being copied to `legacy/`.

---

## Task 1: Scaffold the project

**Files:**
- Create: `legacy/index.html`, `legacy/README.md`, `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`, `src/test/setup.ts`
- Overwrite: `index.html`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing
- Produces: a running dev server; `src/index.css` containing every keyframe later tasks depend on (`about-uncover`, `about-settle`, `qty-roll`, `badge-pop`, `cart-catch`, `.cart-ctl*`, `.brand-lockup`, `.hero-title`)

- [ ] **Step 1: Preserve the original**

```bash
mkdir -p legacy
cp index.html legacy/index.html
```

Create `legacy/README.md`:

```markdown
# Legacy reference

`index.html` here is the original single-file version of the Bombay Heritage
site, preserved byte-for-byte from commit cc0ff73.

It is kept permanently as the visual reference for the React port — open it
side by side with `npm run dev` when verifying that a component matches.

It is not part of the build. Vite only treats the root `index.html` as an
entry point, and this directory is not `public/`, so nothing here ships.
```

- [ ] **Step 2: Initialise the package**

Create `package.json`:

```json
{
  "name": "bombay-heritage",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@iconify-json/solar": "^1.2.0",
    "@iconify/react": "^5.2.0",
    "gsap": "^3.12.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^25.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0"
  }
}
```

Run: `npm install`

- [ ] **Step 3: Configure Vite, TypeScript, and Vitest**

Create `vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 4: Write the Vite entry HTML**

Overwrite `index.html`. Note `class="scroll-smooth"` on `<html>` — anchor navigation depends on it. The body classes come from `legacy/index.html:166-169`.

```html
<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bombay Heritage — Authentic Indian Cuisine</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    class="bg-[#FAF6EF] text-stone-800 antialiased"
    style="font-family: 'Inter', sans-serif"
  >
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Port the stylesheet**

Create `src/index.css`. Everything below the Tailwind import is copied from `legacy/index.html:16-164`, with two deliberate changes: `#cart-badge.is-pop` becomes `.cart-badge.is-pop` and `#cart-btn.is-catching iconify-icon` becomes `.cart-btn.is-catching svg` (Iconify renders an `<svg>`, and id selectors don't survive componentisation).

```css
@import "tailwindcss";

/* About — the story is uncovered like a page of the recipe book, not faded in.
   Runs only once .is-uncovering is set on scroll, so content stays visible if JS never lands. */
@keyframes about-uncover {
  from { opacity: 0; clip-path: inset(0 0 100% 0); transform: translateY(14px); }
  to { opacity: 1; clip-path: inset(0 0 0 0); transform: translateY(0); }
}
@keyframes about-settle {
  from { transform: scale(1.06); }
  to { transform: scale(1); }
}
.about-reveal.is-uncovering .about-uncover-item {
  animation: about-uncover 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i, 0) * 85ms);
}
.about-reveal.is-uncovering .about-uncover-img {
  animation: about-settle 1080ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .about-reveal.is-uncovering .about-uncover-item,
  .about-reveal.is-uncovering .about-uncover-img {
    animation: none;
  }
}

/* The restaurant name is a lockup, never broken across lines. The hero scales
   fluidly instead of stepping, so "Bombay Heritage" fits on one line from a
   320px phone up, then caps at the display size. */
.brand-lockup { white-space: nowrap; }
.hero-title {
  white-space: nowrap;
  font-size: clamp(2rem, 12vw, 4.5rem);
}

/* Add to cart — the pill is the constant. Its face swaps between "Add" and a
   quantity stepper, so the card itself always reports what is in the cart. */
.cart-ctl {
  display: grid;
  min-width: 106px;
  height: 34px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #8b3a2e, #5e2318);
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.cart-ctl:hover { transform: scale(1.05); }
.cart-ctl-face {
  grid-area: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    opacity 240ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}
.cart-ctl-qty {
  opacity: 0;
  transform: scale(0.82);
  pointer-events: none;
}
.cart-ctl.is-qty .cart-ctl-add {
  opacity: 0;
  transform: scale(0.82);
  pointer-events: none;
}
.cart-ctl.is-qty .cart-ctl-qty {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
/* Swallow the tail of a double-click so it cannot land on "−" the instant the stepper appears. */
.cart-ctl.is-arming .cart-ctl-qty { pointer-events: none; }

@keyframes qty-roll {
  from { opacity: 0; transform: translateY(0.55em); }
  to { opacity: 1; transform: none; }
}
.cart-ctl-num.is-rolling {
  animation: qty-roll 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes badge-pop {
  0% { transform: scale(0.4); }
  55% { transform: scale(1.35); }
  100% { transform: scale(1); }
}
.cart-badge.is-pop {
  animation: badge-pop 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* The cart dips as it catches the dish. */
@keyframes cart-catch {
  0% { transform: none; }
  35% { transform: translateY(2px) scale(0.92); }
  100% { transform: none; }
}
.cart-btn.is-catching svg {
  display: inline-block;
  animation: cart-catch 440ms cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  .cart-ctl,
  .cart-ctl-face { transition: none; }
  .cart-ctl:hover { transform: none; }
  .cart-ctl-num.is-rolling,
  .cart-badge.is-pop,
  .cart-btn.is-catching svg { animation: none; }
}
```

- [ ] **Step 6: Create the React root**

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx` as a placeholder that later tasks fill in:

```tsx
export default function App() {
  return <main id="main-view" />;
}
```

- [ ] **Step 7: Update .gitignore**

Add to the top of `.gitignore`, above the `# impeccable-live-ignore-start` marker:

```
node_modules/
dist/
```

- [ ] **Step 8: Verify the scaffold runs**

Run: `npx tsc --noEmit`
Expected: no output, exit 0

Run: `npm run build`
Expected: succeeds, writes `dist/index.html` and `dist/assets/*`

Run: `npm run dev`, open the printed URL
Expected: blank cream page (`#FAF6EF`) — confirms Tailwind processed the body class

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript + Tailwind v4

Preserve the original single-file site at legacy/index.html as the
visual reference for the port."
```

---

## Task 2: Menu data and money formatting

**Files:**
- Create: `src/data/menu.ts`, `src/lib/money.ts`, `src/lib/money.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `MenuItem` type; `MENU_CATEGORIES: Category[]`; `MENU_ITEMS: MenuItem[]`; `SPECIALS: MenuItem[]`; `money(n: number): string`

- [ ] **Step 1: Write the failing test**

Create `src/lib/money.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { money } from "./money";

describe("money", () => {
  it("formats whole numbers with two decimals", () => {
    expect(money(6)).toBe("$6.00");
  });

  it("formats fractional prices", () => {
    expect(money(17.5)).toBe("$17.50");
  });

  it("formats zero", () => {
    expect(money(0)).toBe("$0.00");
  });

  it("rounds to two decimals", () => {
    expect(money(6.005)).toBe("$6.01");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/money.test.ts`
Expected: FAIL — cannot resolve `./money`

- [ ] **Step 3: Implement money**

Create `src/lib/money.ts`:

```ts
export function money(n: number): string {
  return "$" + n.toFixed(2);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/money.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 5: Port the menu data**

Create `src/data/menu.ts`. Item values are copied from `legacy/index.html:1246-1356` with no changes.

```ts
export type CategoryId = "starters" | "mains" | "breads" | "desserts";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  veg: boolean;
  signature: boolean;
  price: number;
  desc: string;
  img: string;
}

export const MENU_CATEGORIES: Category[] = [
  { id: "starters", label: "Starters" },
  { id: "mains", label: "Mains" },
  { id: "breads", label: "Breads & Rice" },
  { id: "desserts", label: "Desserts" },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "samosa",
    name: "Vegetable Samosa",
    category: "starters",
    veg: true,
    signature: false,
    price: 6.5,
    desc: "Crisp pastry, spiced potato & peas, tamarind chutney.",
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "seekh",
    name: "Seekh Kebab",
    category: "starters",
    veg: false,
    signature: false,
    price: 9.5,
    desc: "Minced lamb skewers, charred over open flame.",
    img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    category: "mains",
    veg: false,
    signature: true,
    price: 17.5,
    desc: "Slow-cooked tomato-cashew curry, tandoori chicken.",
    img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "dal-makhani",
    name: "Dal Makhani",
    category: "mains",
    veg: true,
    signature: true,
    price: 13.5,
    desc: "Eighteen-hour black lentils, cream, smoked butter.",
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "palak-paneer",
    name: "Palak Paneer",
    category: "mains",
    veg: true,
    signature: false,
    price: 14.5,
    desc: "Fresh spinach purée, house-made paneer.",
    img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "lamb-rogan",
    name: "Lamb Rogan Josh",
    category: "mains",
    veg: false,
    signature: true,
    price: 19.5,
    desc: "Kashmiri chillies, yogurt, slow-braised lamb shoulder.",
    img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "garlic-naan",
    name: "Garlic Naan",
    category: "breads",
    veg: true,
    signature: false,
    price: 4.5,
    desc: "Tandoor-charred flatbread, roasted garlic & herbs.",
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "jeera-rice",
    name: "Jeera Rice",
    category: "breads",
    veg: true,
    signature: false,
    price: 5.5,
    desc: "Basmati rice tempered with cumin & ghee.",
    img: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun",
    category: "desserts",
    veg: true,
    signature: false,
    price: 6.0,
    desc: "Warm milk dumplings in cardamom-rose syrup.",
    img: "https://images.unsplash.com/photo-1601303516361-1c1e5aa5e7b3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "kulfi",
    name: "Saffron Kulfi",
    category: "desserts",
    veg: true,
    signature: true,
    price: 6.5,
    desc: "Hand-churned pistachio-saffron kulfi.",
    img: "https://images.unsplash.com/photo-1590080876229-7b2f2eaf3a6d?q=80&w=800&auto=format&fit=crop",
  },
];

export const SPECIALS: MenuItem[] = MENU_ITEMS.filter((i) => i.signature);

export function findItem(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((i) => i.id === id);
}
```

- [ ] **Step 6: Verify types and tests**

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean type check, 4 tests pass

- [ ] **Step 7: Commit**

```bash
git add src/data src/lib
git commit -m "feat: port menu data and money formatting"
```

---

## Task 3: Pure cart logic

**Files:**
- Create: `src/lib/cart.ts`, `src/lib/cart.test.ts`

**Interfaces:**
- Consumes: `MenuItem`, `MENU_ITEMS` from `src/data/menu.ts`
- Produces: `CartItems = Record<string, number>`; `addItem(state, id): CartItems`; `changeQty(state, id, delta): CartItems`; `cartCount(state): number`; `cartSubtotal(state, items): number`

This is the only non-visual logic in the application, so it gets real test coverage. All four functions are pure and return new objects — never mutate.

- [ ] **Step 1: Write the failing tests**

Create `src/lib/cart.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { addItem, cartCount, cartSubtotal, changeQty } from "./cart";
import { MENU_ITEMS } from "../data/menu";

describe("addItem", () => {
  it("creates a line at quantity 1 for a new dish", () => {
    expect(addItem({}, "samosa")).toEqual({ samosa: 1 });
  });

  it("increments an existing dish", () => {
    expect(addItem({ samosa: 2 }, "samosa")).toEqual({ samosa: 3 });
  });

  it("leaves other lines untouched", () => {
    expect(addItem({ kulfi: 1 }, "samosa")).toEqual({ kulfi: 1, samosa: 1 });
  });

  it("does not mutate the input", () => {
    const state = { samosa: 1 };
    addItem(state, "samosa");
    expect(state).toEqual({ samosa: 1 });
  });
});

describe("changeQty", () => {
  it("increments by a positive delta", () => {
    expect(changeQty({ samosa: 1 }, "samosa", 1)).toEqual({ samosa: 2 });
  });

  it("decrements by a negative delta", () => {
    expect(changeQty({ samosa: 3 }, "samosa", -1)).toEqual({ samosa: 2 });
  });

  it("removes the line entirely when it reaches zero", () => {
    expect(changeQty({ samosa: 1 }, "samosa", -1)).toEqual({});
  });

  it("removes the line when it would go below zero", () => {
    expect(changeQty({ samosa: 1 }, "samosa", -5)).toEqual({});
  });

  it("ignores a dish that is not in the cart", () => {
    expect(changeQty({ kulfi: 1 }, "samosa", 1)).toEqual({ kulfi: 1 });
  });

  it("does not mutate the input", () => {
    const state = { samosa: 2 };
    changeQty(state, "samosa", -1);
    expect(state).toEqual({ samosa: 2 });
  });
});

describe("cartCount", () => {
  it("is zero for an empty cart", () => {
    expect(cartCount({})).toBe(0);
  });

  it("sums quantities across lines", () => {
    expect(cartCount({ samosa: 2, kulfi: 3 })).toBe(5);
  });
});

describe("cartSubtotal", () => {
  it("is zero for an empty cart", () => {
    expect(cartSubtotal({}, MENU_ITEMS)).toBe(0);
  });

  it("multiplies price by quantity for a single line", () => {
    // samosa 6.50 x 2
    expect(cartSubtotal({ samosa: 2 }, MENU_ITEMS)).toBeCloseTo(13.0, 2);
  });

  it("sums mixed quantities and prices", () => {
    // samosa 6.50 x 2 = 13.00, butter-chicken 17.50 x 1 = 17.50
    expect(cartSubtotal({ samosa: 2, "butter-chicken": 1 }, MENU_ITEMS))
      .toBeCloseTo(30.5, 2);
  });

  it("skips ids that are not on the menu", () => {
    expect(cartSubtotal({ "not-a-dish": 4 }, MENU_ITEMS)).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/cart.test.ts`
Expected: FAIL — cannot resolve `./cart`

- [ ] **Step 3: Implement the cart reducers**

Create `src/lib/cart.ts`:

```ts
import type { MenuItem } from "../data/menu";

export type CartItems = Record<string, number>;

export function addItem(state: CartItems, id: string): CartItems {
  return { ...state, [id]: (state[id] ?? 0) + 1 };
}

export function changeQty(
  state: CartItems,
  id: string,
  delta: number,
): CartItems {
  if (!state[id]) return state;
  const next = { ...state, [id]: state[id] + delta };
  if (next[id] <= 0) delete next[id];
  return next;
}

export function cartCount(state: CartItems): number {
  return Object.values(state).reduce((sum, qty) => sum + qty, 0);
}

export function cartSubtotal(state: CartItems, items: MenuItem[]): number {
  return Object.entries(state).reduce((sum, [id, qty]) => {
    const item = items.find((i) => i.id === id);
    return item ? sum + item.price * qty : sum;
  }, 0);
}
```

Note: the original throws if a cart id is missing from the menu (`legacy/index.html:1642`). `cartSubtotal` skips it instead — a cart can only ever contain menu ids, so this is unreachable in practice and the safer branch avoids a crash.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/cart.test.ts`
Expected: PASS, 16 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/cart.ts src/lib/cart.test.ts
git commit -m "feat: add pure cart reducers with unit tests"
```

---

## Task 4: UI context and Toast

**Files:**
- Create: `src/context/UIContext.tsx`, `src/components/ui/Toast.tsx`, `src/components/ui/Icon.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `useUI(): UIContextValue` where `UIContextValue = { cartOpen: boolean; openCart(): void; closeCart(): void; authMode: "login" | "signup" | null; openAuth(mode: "login" | "signup"): void; closeAuth(): void; toggleAuthMode(): void; mobileMenuOpen: boolean; toggleMobileMenu(): void; closeMobileMenu(): void; toast: string | null; showToast(message: string): void }`
  - `<UIProvider>`
  - `<Icon icon={string} width={number} className?={string} />`
  - `<Toast />`

- [ ] **Step 1: Write the Icon wrapper**

Create `src/components/ui/Icon.tsx`. The original sets `stroke-width="1.5"` on every icon and `aria-hidden="true"` on all but none — every `iconify-icon` in `legacy/index.html` carries `aria-hidden="true"`. Both become defaults.

```tsx
import { Icon as IconifyIcon } from "@iconify/react";

interface IconProps {
  icon: string;
  width: number;
  className?: string;
}

export function Icon({ icon, width, className }: IconProps) {
  return (
    <IconifyIcon
      icon={icon}
      width={width}
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Write the failing test for toast auto-dismiss**

Create `src/context/UIContext.test.tsx`:

```tsx
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UIProvider, useUI } from "./UIContext";

function Probe() {
  const { toast, showToast, authMode, openAuth, toggleAuthMode } = useUI();
  return (
    <div>
      <button onClick={() => showToast("Added")}>fire</button>
      <button onClick={() => openAuth("login")}>auth</button>
      <button onClick={toggleAuthMode}>toggle</button>
      <span data-testid="toast">{toast ?? "none"}</span>
      <span data-testid="mode">{authMode ?? "closed"}</span>
    </div>
  );
}

describe("UIProvider", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows a toast and clears it after 3000ms", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <UIProvider>
        <Probe />
      </UIProvider>,
    );

    expect(screen.getByTestId("toast")).toHaveTextContent("none");
    await user.click(screen.getByText("fire"));
    expect(screen.getByTestId("toast")).toHaveTextContent("Added");

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("toast")).toHaveTextContent("none");
  });

  it("toggles auth mode between login and signup", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <UIProvider>
        <Probe />
      </UIProvider>,
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("closed");
    await user.click(screen.getByText("auth"));
    expect(screen.getByTestId("mode")).toHaveTextContent("login");
    await user.click(screen.getByText("toggle"));
    expect(screen.getByTestId("mode")).toHaveTextContent("signup");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/context/UIContext.test.tsx`
Expected: FAIL — cannot resolve `./UIContext`

- [ ] **Step 4: Implement UIContext**

Create `src/context/UIContext.tsx`:

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AuthMode = "login" | "signup";

interface UIContextValue {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  authMode: AuthMode | null;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  toggleAuthMode: () => void;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const value = useMemo<UIContextValue>(
    () => ({
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      authMode,
      openAuth: (mode: AuthMode) => setAuthMode(mode),
      closeAuth: () => setAuthMode(null),
      toggleAuthMode: () =>
        setAuthMode((m) => (m === "login" ? "signup" : "login")),
      mobileMenuOpen,
      toggleMobileMenu: () => setMobileMenuOpen((o) => !o),
      closeMobileMenu: () => setMobileMenuOpen(false),
      toast,
      showToast,
    }),
    [cartOpen, authMode, mobileMenuOpen, toast, showToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/context/UIContext.test.tsx`
Expected: PASS, 2 tests

- [ ] **Step 6: Implement Toast**

Create `src/components/ui/Toast.tsx`. Markup from `legacy/index.html:1232-1242`. The original toggles `translate-y-24 opacity-0`; here that is driven by whether a message is present.

```tsx
import { useUI } from "../../context/UIContext";

export function Toast() {
  const { toast } = useUI();
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] transition-all duration-300 pointer-events-none ${
        toast ? "" : "translate-y-24 opacity-0"
      }`}
    >
      <div
        className="rounded-full px-5 py-3 text-sm font-medium text-[#FAF6EF] shadow-lg"
        style={{ background: "#231008" }}
      >
        <span>{toast}</span>
      </div>
    </div>
  );
}
```

Note the original's outer div keeps `-translate-x-1/2` at all times and adds `translate-y-24` on top. Tailwind merges both transforms, so the shown state must keep `-translate-x-1/2` — it does, because it is outside the conditional.

- [ ] **Step 7: Wire the provider into App**

Replace `src/App.tsx`:

```tsx
import { UIProvider } from "./context/UIContext";
import { Toast } from "./components/ui/Toast";

export default function App() {
  return (
    <UIProvider>
      <main id="main-view" />
      <Toast />
    </UIProvider>
  );
}
```

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean, 22 tests pass

- [ ] **Step 9: Commit**

```bash
git add src/context src/components/ui src/App.tsx
git commit -m "feat: add UI context, Toast, and Icon wrapper"
```

---

## Task 5: Cart context and the fly-to-cart animation

**Files:**
- Create: `src/lib/flyToCart.ts`, `src/context/CartContext.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useUI` (for `showToast`), `addItem`/`changeQty`/`cartCount`/`cartSubtotal` from `src/lib/cart.ts`, `MENU_ITEMS`, `MenuItem`
- Produces:
  - `flyToCart(imgEl: HTMLImageElement | null, cartBtn: HTMLElement | null, item: MenuItem): Promise<void> | null`
  - `useCart(): CartContextValue` where `CartContextValue = { items: CartItems; displayCount: number; subtotal: number; catching: boolean; qtyOf(id: string): number; addToCart(item: MenuItem, imgEl: HTMLImageElement | null): void; setQty(id: string, delta: number): void; cartButtonRef: React.RefObject<HTMLButtonElement | null> }`
  - `<CartProvider>`

`setQty` is the context method name; the pure reducer it wraps is `changeQty`. Later tasks call `setQty`.

- [ ] **Step 1: Port the flight animation**

Create `src/lib/flyToCart.ts`. Body copied from `legacy/index.html:1454-1526`; only the signature changes — it receives elements instead of looking them up by id.

```ts
import type { MenuItem } from "../data/menu";

/* The first add throws the dish into the navbar cart. Horizontal travel lives on
   the outer node and vertical on the inner one, so the two easings compose into a
   real arc instead of a straight diagonal. */
export function flyToCart(
  imgEl: HTMLImageElement | null,
  cartBtn: HTMLElement | null,
  item: MenuItem,
): Promise<void> | null {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (
    reducedMotion.matches ||
    !imgEl ||
    !cartBtn ||
    typeof Element.prototype.animate !== "function"
  ) {
    return null;
  }

  const from = imgEl.getBoundingClientRect();
  const to = cartBtn.getBoundingClientRect();
  if (!from.width || !to.width) return null;

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const endScale = (to.width * 0.5) / from.width;

  const outer = document.createElement("div");
  outer.style.cssText = `position:fixed;left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;z-index:75;pointer-events:none;will-change:transform`;
  const inner = document.createElement("div");
  inner.style.cssText = `width:100%;height:100%;border-radius:24px;background:url("${item.img}") center/cover no-repeat;box-shadow:0 18px 40px -12px rgba(58,21,9,.45);will-change:transform;`;
  outer.appendChild(inner);
  document.body.appendChild(outer);

  const DURATION = 620;
  outer.animate(
    [{ transform: "translateX(0)" }, { transform: `translateX(${dx}px)` }],
    {
      duration: DURATION,
      easing: "cubic-bezier(0.55, 0, 0.85, 0.5)",
      fill: "forwards",
    },
  );
  const flight = inner.animate(
    [
      { transform: "translateY(0) scale(1)", borderRadius: "24px", opacity: 1 },
      {
        transform: `translateY(${dy * 0.66}px) scale(${(1 + endScale) / 2})`,
        borderRadius: "38%",
        opacity: 1,
        offset: 0.55,
      },
      {
        transform: `translateY(${dy}px) scale(${endScale})`,
        borderRadius: "50%",
        opacity: 0.2,
      },
    ],
    {
      duration: DURATION,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "forwards",
    },
  );

  return flight.finished
    .catch(() => {})
    .then(() => {
      outer.remove();
    });
}
```

- [ ] **Step 2: Implement CartContext**

Create `src/context/CartContext.tsx`. Two behaviours from the original need care: `badgeHeld` (`legacy/index.html:1536-1543, 1578, 1603`) keeps the badge showing the pre-add count until the dish lands, and the cart button plays `cart-catch` for 460ms after landing (`legacy/index.html:1523-1524`).

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MENU_ITEMS, type MenuItem } from "../data/menu";
import {
  addItem,
  cartCount,
  cartSubtotal,
  changeQty,
  type CartItems,
} from "../lib/cart";
import { flyToCart } from "../lib/flyToCart";
import { useUI } from "./UIContext";

interface CartContextValue {
  items: CartItems;
  displayCount: number;
  subtotal: number;
  catching: boolean;
  qtyOf: (id: string) => number;
  addToCart: (item: MenuItem, imgEl: HTMLImageElement | null) => void;
  setQty: (id: string, delta: number) => void;
  cartButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>({});
  const [heldCount, setHeldCount] = useState<number | null>(null);
  const [catching, setCatching] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);
  const { showToast } = useUI();

  const count = cartCount(items);
  const displayCount = heldCount ?? count;
  const subtotal = useMemo(() => cartSubtotal(items, MENU_ITEMS), [items]);

  const addToCart = useCallback(
    (item: MenuItem, imgEl: HTMLImageElement | null) => {
      const isFirst = !items[item.id];
      if (isFirst) {
        const flight = flyToCart(imgEl, cartButtonRef.current, item);
        if (flight) {
          // Hold the count until the dish lands, so the badge reads as catching it.
          setHeldCount(count);
          void flight.then(() => {
            setHeldCount(null);
            setCatching(true);
            setTimeout(() => setCatching(false), 460);
          });
        }
        showToast(`${item.name} added to cart`);
      }
      setItems((prev) => addItem(prev, item.id));
    },
    [items, count, showToast],
  );

  const setQty = useCallback((id: string, delta: number) => {
    setItems((prev) => changeQty(prev, id, delta));
  }, []);

  const qtyOf = useCallback((id: string) => items[id] ?? 0, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      displayCount,
      subtotal,
      catching,
      qtyOf,
      addToCart,
      setQty,
      cartButtonRef,
    }),
    [items, displayCount, subtotal, catching, qtyOf, addToCart, setQty],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

The `isFirst` check reads `items` from the closure rather than from inside the `setItems` updater, so the flight and the toast fire exactly once — side effects inside a state updater run twice under React 19 StrictMode.

- [ ] **Step 3: Nest the providers**

Replace `src/App.tsx`. `CartProvider` calls `useUI`, so it must be inside `UIProvider`.

```tsx
import { UIProvider } from "./context/UIContext";
import { CartProvider } from "./context/CartContext";
import { Toast } from "./components/ui/Toast";

export default function App() {
  return (
    <UIProvider>
      <CartProvider>
        <main id="main-view" />
        <Toast />
      </CartProvider>
    </UIProvider>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean, 22 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/flyToCart.ts src/context/CartContext.tsx src/App.tsx
git commit -m "feat: add cart context with fly-to-cart flight animation"
```

---

## Task 6: Scroll reveal primitives

**Files:**
- Create: `src/lib/gsap.ts`, `src/hooks/useReveal.ts`, `src/hooks/useAboutUncover.ts`, `src/components/ui/RevealWords.tsx`, `src/components/ui/GradientBorder.tsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `useReveal<T extends HTMLElement>(): React.RefObject<T | null>` — attach to any element to replace `data-reveal`
  - `useAboutUncover<T extends HTMLElement>(): React.RefObject<T | null>`
  - `<RevealWords as="h1" className={string} style?={CSSProperties}>text</RevealWords>`
  - `<GradientBorder gradient={string} className={string} innerClassName={string} innerStyle?={CSSProperties}>children</GradientBorder>`

`useReveal` returns a ref rather than rendering a wrapper element, so the DOM stays structurally identical to the original.

- [ ] **Step 1: Register GSAP once**

Create `src/lib/gsap.ts`:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Implement useReveal**

Create `src/hooks/useReveal.ts`. Values from `legacy/index.html:1828-1840`.

```ts
import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return ref;
}
```

- [ ] **Step 3: Implement RevealWords**

Create `src/components/ui/RevealWords.tsx`. Replaces the `innerHTML` rewrite at `legacy/index.html:1841-1859`. Splitting happens at render time instead of by DOM mutation.

```tsx
import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "../../lib/gsap";

interface RevealWordsProps {
  as: "h1" | "h2";
  children: string;
  className?: string;
  style?: CSSProperties;
}

export function RevealWords({
  as: Tag,
  children,
  className,
  style,
}: RevealWordsProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el.querySelectorAll("span"), {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Collapse the source formatting's newlines and indentation first —
  // splitting on a single space would emit an empty span per stray space.
  const words = children.trim().split(/\s+/);

  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: "inline-block",
            opacity: 0,
            transform: "translateY(0.4em)",
          }}
        >
          {word}
        </span>
      )).reduce<React.ReactNode[]>(
        (acc, node, i) => (i === 0 ? [node] : [...acc, " ", node]),
        [],
      )}
    </Tag>
  );
}
```

The `reduce` inserts a literal space between spans, matching the original's `.join(" ")` — without it the words run together, because `inline-block` spans have no whitespace between JSX siblings.

- [ ] **Step 4: Implement useAboutUncover**

Create `src/hooks/useAboutUncover.ts`. From `legacy/index.html:1863-1871`.

```ts
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "../lib/gsap";

// About uncover: hand the moment to CSS once the section arrives, so the
// clip-path sequence plays on scroll rather than finishing before it is seen.
export function useAboutUncover<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => el.classList.add("is-uncovering"),
    });
    return () => trigger.kill();
  }, []);

  return ref;
}
```

- [ ] **Step 5: Implement GradientBorder**

Create `src/components/ui/GradientBorder.tsx`. Abstracts the `p-px` shell used at `legacy/index.html:379-397` (hero strip), `552-570` (about image), `605-678` (three stat cards), `706-799` (contact info), `800-821` (map), `951-970` (newsletter), and `1010-1024` (cart drawer).

```tsx
import type { CSSProperties, ReactNode } from "react";

interface GradientBorderProps {
  gradient: string;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  children: ReactNode;
}

export function GradientBorder({
  gradient,
  className = "",
  style,
  innerClassName = "",
  innerStyle,
  children,
}: GradientBorderProps) {
  return (
    <div
      className={`p-px ${className}`}
      style={{ background: gradient, ...style }}
    >
      <div className={innerClassName} style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
```

Callers supply the radius on both `className` and `innerClassName` — the original repeats the radius class on the wrapper and the inner surface, and matching that keeps the rendered classes identical.

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean, 22 tests pass

- [ ] **Step 7: Commit**

```bash
git add src/lib/gsap.ts src/hooks src/components/ui
git commit -m "feat: add scroll reveal hooks and gradient border primitive"
```

---

## Task 7: Navbar and mobile menu

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useUI`, `useCart` (for `displayCount`, `catching`, `cartButtonRef`), `Icon`
- Produces: `<Navbar />`

Source: `legacy/index.html:171-300`. The badge and cart button carry the new `cart-badge` / `cart-btn` classes that Task 1's CSS targets.

- [ ] **Step 1: Implement Navbar**

Create `src/components/layout/Navbar.tsx`:

```tsx
import { useEffect, useState } from "react";
import { useUI } from "../../context/UIContext";
import { useCart } from "../../context/CartContext";
import { Icon } from "../ui/Icon";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#menu", label: "Menu" },
  { href: "#specials", label: "Chef's Specials" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const BRAND_GRADIENT = "linear-gradient(135deg, #8b3a2e, #5e2318)";

export function Navbar() {
  const { openCart, openAuth, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useUI();
  const { displayCount, catching, cartButtonRef } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(250, 246, 239, 0.85)",
        borderBottom: "1px solid rgba(139, 58, 46, 0.08)",
        boxShadow: scrolled ? "0 1px 0 rgba(139,58,46,.1)" : "none",
      }}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <a href="#home" className="flex items-center gap-2.5">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#FAF6EF]"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon icon="solar:fire-linear" width={18} />
          </span>
          <span
            className="brand-lockup text-lg tracking-tight text-[#5E2318]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Bombay Heritage
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#8B3A2E] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            ref={cartButtonRef}
            aria-label={
              displayCount === 0
                ? "Open cart"
                : `Open cart, ${displayCount} item${displayCount === 1 ? "" : "s"}`
            }
            onClick={openCart}
            className={`cart-btn relative w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-[#8B3A2E]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B3A2E]/40 ${
              catching ? "is-catching" : ""
            }`}
          >
            <Icon icon="solar:cart-large-2-linear" width={22} />
            {displayCount > 0 && (
              <span
                key={displayCount}
                className="cart-badge is-pop absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B3A2E] text-white text-xs font-semibold flex items-center justify-center"
              >
                {displayCount}
              </span>
            )}
          </button>
          <button
            onClick={() => openAuth("login")}
            className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-[#FAF6EF] transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#8B3A2E]/40"
            style={{ background: BRAND_GRADIENT }}
          >
            Login / Sign Up
          </button>
          <button
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-[#8B3A2E]/10 transition-colors"
          >
            <Icon icon="solar:hamburger-menu-linear" width={22} />
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1 text-sm font-medium text-stone-700"
          style={{ borderTop: "1px solid rgba(139, 58, 46, 0.08)" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className="block px-3 py-2.5 rounded-lg hover:bg-[#8B3A2E]/10"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => openAuth("login")}
            className="mt-2 w-full rounded-full px-4 py-2.5 text-sm font-medium text-[#FAF6EF]"
            style={{ background: BRAND_GRADIENT }}
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </header>
  );
}
```

The `key={displayCount}` on the badge remounts it whenever the count changes, restarting `badge-pop` — this replaces the original's `void badge.offsetWidth` reflow hack.

- [ ] **Step 2: Mount it**

In `src/App.tsx`, add `import { Navbar } from "./components/layout/Navbar";` and render `<Navbar />` immediately inside `<CartProvider>`, above `<main id="main-view" />`.

- [ ] **Step 3: Verify against the original**

Run: `npm run dev`

Open the dev server and `legacy/index.html` side by side. Confirm: brand lockup does not wrap; nav links appear at ≥768px and collapse below; the hamburger appears below 768px and toggles the panel; the "Login / Sign Up" pill hides below 640px; scrolling past 8px adds the hairline shadow; the cart badge is absent at zero.

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/App.tsx
git commit -m "feat: port navbar and mobile menu"
```

---

## Task 8: Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useReveal`, `RevealWords`, `GradientBorder`, `Icon`
- Produces: `<Hero />`

Source: `legacy/index.html:304-434`. Four `data-reveal` elements (badge, paragraph, button row, info strip) and one `data-reveal-words` (the `h1`).

- [ ] **Step 1: Implement Hero**

Create `src/components/sections/Hero.tsx`:

```tsx
import { useReveal } from "../../hooks/useReveal";
import { RevealWords } from "../ui/RevealWords";
import { GradientBorder } from "../ui/GradientBorder";
import { Icon } from "../ui/Icon";

export function Hero() {
  const badgeRef = useReveal<HTMLSpanElement>();
  const leadRef = useReveal<HTMLParagraphElement>();
  const ctaRef = useReveal<HTMLDivElement>();
  const stripRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-end sm:items-center pt-16"
    >
      <img
        src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000&auto=format&fit=crop"
        alt="Signature butter chicken curry served in a copper bowl with fresh herbs"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(24, 10, 6, 0.88) 0%, rgba(24, 10, 6, 0.65) 45%, rgba(24, 10, 6, 0.25) 100%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 sm:pb-0">
        <div className="max-w-2xl">
          <span
            ref={badgeRef}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#E8C87E] mb-6"
            style={{
              border: "1px solid rgba(198, 151, 63, 0.4)",
              background: "rgba(198, 151, 63, 0.1)",
            }}
          >
            <Icon icon="solar:star-linear" width={14} />
            Est. 1987 · A family recipe legacy
          </span>
          <RevealWords
            as="h1"
            className="hero-title tracking-tight text-[#FAF6EF] leading-[1.05]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Bombay Heritage
          </RevealWords>
          <p
            ref={leadRef}
            className="mt-5 text-base sm:text-lg text-stone-300 max-w-lg leading-relaxed"
          >
            Authentic Indian flavours, served the way they were meant to be —
            slow-cooked, hand-spiced, and shared around the table.
          </p>
          <div ref={ctaRef} className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#menu"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-[#3A1509] transition-transform hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, #e8c87e, #c6973f)" }}
            >
              Order Now
              <Icon icon="solar:arrow-right-linear" width={17} />
            </a>
            <a
              href="#specials"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-[#FAF6EF] transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(250, 246, 239, 0.3)" }}
            >
              View Chef&apos;s Specials
            </a>
          </div>
          <div ref={stripRef} className="mt-12">
          <GradientBorder
            gradient="linear-gradient(135deg, rgba(198, 151, 63, 0.5), rgba(250, 246, 239, 0.08), rgba(198, 151, 63, 0.35))"
            className="rounded-2xl"
            innerClassName="rounded-2xl px-5 py-4 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-stone-300"
            innerStyle={{
              background: "rgba(24, 10, 6, 0.7)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="flex items-center gap-2">
              <Icon
                icon="solar:clock-circle-linear"
                width={17}
                className="text-[#E8C87E]"
              />
              Open daily · 11:30 AM – 10:30 PM
            </span>
            <span className="flex items-center gap-2">
              <Icon
                icon="solar:map-point-linear"
                width={17}
                className="text-[#E8C87E]"
              />
              42 Spice Lane, Old Town
            </span>
            <a
              href="tel:+15551234567"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Icon
                icon="solar:phone-linear"
                width={17}
                className="text-[#E8C87E]"
              />
              (555) 123-4567
            </a>
          </GradientBorder>
          </div>
        </div>
      </div>
    </section>
  );
}
```

`GradientBorder` does not forward refs, so the info strip is wrapped in a plain `<div ref={stripRef} className="mt-12">` and the `mt-12` moves off the `GradientBorder`. This adds one wrapper div the original does not have; it is a layout-neutral block element carrying only the margin, so the rendered result is unchanged.

- [ ] **Step 2: Mount it**

In `src/App.tsx`, import `Hero` and render `<Hero />` inside `<main id="main-view">`.

- [ ] **Step 3: Verify against the original**

Run: `npm run dev`

Confirm at 375px, 768px, and 1440px: the hero fills 92vh; "Bombay Heritage" stays on one line and scales fluidly; content bottom-aligns below 640px and centres above; the scrim darkens left to right; the info strip stacks vertically below 640px; the word stagger runs on load.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx src/App.tsx
git commit -m "feat: port hero section"
```

---

## Task 9: Dish card and cart control

**Files:**
- Create: `src/components/dish/CartControl.tsx`, `src/components/dish/DishCard.tsx`, `src/components/dish/CartControl.test.tsx`

**Interfaces:**
- Consumes: `useCart`, `Icon`, `money`, `MenuItem`
- Produces:
  - `<CartControl item={MenuItem} imgRef={React.RefObject<HTMLImageElement | null>} />`
  - `<DishCard item={MenuItem} />`

Source: `legacy/index.html:1367-1406`. The pill's two faces share one grid cell so the swap reads as a morph.

- [ ] **Step 1: Write the failing test**

Create `src/components/dish/CartControl.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UIProvider } from "../../context/UIContext";
import { CartProvider } from "../../context/CartContext";
import { DishCard } from "./DishCard";
import { MENU_ITEMS } from "../../data/menu";

const samosa = MENU_ITEMS.find((i) => i.id === "samosa")!;

function renderCard() {
  return render(
    <UIProvider>
      <CartProvider>
        <DishCard item={samosa} />
      </CartProvider>
    </UIProvider>,
  );
}

describe("CartControl", () => {
  it("starts in the Add state", () => {
    const { container } = renderCard();
    expect(container.querySelector(".cart-ctl")).not.toHaveClass("is-qty");
    expect(
      screen.getByRole("button", { name: /Add Vegetable Samosa to cart/i }),
    ).toBeInTheDocument();
  });

  it("switches to the quantity state after adding", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();

    await user.click(
      screen.getByRole("button", { name: /Add Vegetable Samosa to cart/i }),
    );

    expect(container.querySelector(".cart-ctl")).toHaveClass("is-qty");
    expect(container.querySelector(".cart-ctl-num")).toHaveTextContent("1");
  });

  it("increments and decrements through the stepper", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();

    await user.click(
      screen.getByRole("button", { name: /Add Vegetable Samosa to cart/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Add one more Vegetable Samosa/i }),
    );
    expect(container.querySelector(".cart-ctl-num")).toHaveTextContent("2");

    await user.click(
      screen.getByRole("button", { name: /Remove one Vegetable Samosa/i }),
    );
    expect(container.querySelector(".cart-ctl-num")).toHaveTextContent("1");
  });

  it("returns to the Add state when the quantity reaches zero", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();

    await user.click(
      screen.getByRole("button", { name: /Add Vegetable Samosa to cart/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Remove one Vegetable Samosa/i }),
    );

    expect(container.querySelector(".cart-ctl")).not.toHaveClass("is-qty");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/dish/CartControl.test.tsx`
Expected: FAIL — cannot resolve `./DishCard`

- [ ] **Step 3: Implement CartControl**

Create `src/components/dish/CartControl.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { Icon } from "../ui/Icon";
import type { MenuItem } from "../../data/menu";

interface CartControlProps {
  item: MenuItem;
  imgRef: React.RefObject<HTMLImageElement | null>;
}

export function CartControl({ item, imgRef }: CartControlProps) {
  const { qtyOf, addToCart, setQty } = useCart();
  const qty = qtyOf(item.id);

  // Swallow the tail of a double-click so it cannot land on "−" the instant
  // the stepper appears.
  const [arming, setArming] = useState(false);
  const prevQty = useRef(qty);
  useEffect(() => {
    const wasEmpty = prevQty.current === 0;
    prevQty.current = qty;
    if (!wasEmpty || qty !== 1) return;
    setArming(true);
    const timer = setTimeout(() => setArming(false), 340);
    return () => clearTimeout(timer);
  }, [qty]);

  return (
    <div
      className={`cart-ctl ${qty > 0 ? "is-qty" : ""} ${arming ? "is-arming" : ""}`}
    >
      <div className="cart-ctl-face cart-ctl-add">
        <button
          type="button"
          onClick={() => addToCart(item, imgRef.current)}
          aria-label={`Add ${item.name} to cart`}
          className="w-full h-full inline-flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold text-[#FAF6EF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B3A2E]/50"
        >
          <Icon icon="solar:cart-plus-linear" width={14} /> Add
        </button>
      </div>
      <div className="cart-ctl-face cart-ctl-qty px-1">
        <button
          type="button"
          onClick={() => setQty(item.id, -1)}
          aria-label={`Remove one ${item.name} from cart`}
          className="w-8 h-8 shrink-0 rounded-full inline-flex items-center justify-center text-sm text-[#FAF6EF] hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          −
        </button>
        <span
          key={qty}
          className="cart-ctl-num is-rolling flex-1 text-center text-xs font-semibold text-[#FAF6EF] tabular-nums"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty(item.id, 1)}
          aria-label={`Add one more ${item.name} to cart`}
          className="w-8 h-8 shrink-0 rounded-full inline-flex items-center justify-center text-sm text-[#FAF6EF] hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          +
        </button>
      </div>
    </div>
  );
}
```

The `−` character is U+2212 MINUS SIGN, not a hyphen — copy it from `legacy/index.html:1379`.

`key={qty}` remounts the number span on every change, restarting `qty-roll`. This replaces the original's `void num.offsetWidth` reflow.

- [ ] **Step 4: Implement DishCard**

Create `src/components/dish/DishCard.tsx`:

```tsx
import { useRef } from "react";
import { CartControl } from "./CartControl";
import { Icon } from "../ui/Icon";
import { money } from "../../lib/money";
import type { MenuItem } from "../../data/menu";

export function DishCard({ item }: { item: MenuItem }) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  return (
    <div
      className="rounded-3xl p-px shrink-0 snap-start"
      style={{
        background:
          "linear-gradient(135deg,rgba(198,151,63,.5),rgba(139,58,46,.1),rgba(198,151,63,.3))",
      }}
    >
      <div className="rounded-3xl bg-white overflow-hidden h-full flex flex-col">
        <div className="relative h-44">
          <img
            ref={imgRef}
            src={item.img}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          {item.signature && (
            <span
              className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#3A1509]"
              style={{ background: "linear-gradient(135deg,#E8C87E,#C6973F)" }}
            >
              <Icon icon="solar:fire-linear" width={12} /> Signature
            </span>
          )}
          <span
            className="absolute top-3 right-3 w-3 h-3 rounded-full"
            style={{
              background: item.veg ? "#3E8E5A" : "#8B3A2E",
              boxShadow: "0 0 0 3px rgba(0,0,0,.08)",
            }}
            aria-label={item.veg ? "Vegetarian" : "Non-vegetarian"}
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3
            className="text-lg tracking-tight text-[#3A1509]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            {item.name}
          </h3>
          <p className="mt-1.5 text-xs text-stone-500 leading-relaxed flex-1">
            {item.desc}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#8B3A2E] tabular-nums">
              {money(item.price)}
            </span>
            <CartControl item={item} imgRef={imgRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

The original's `data-dish` attribute is dropped — it existed only so `flyToCart` could find the image via `closest("[data-dish]")`, which the ref now handles.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/dish/CartControl.test.tsx`
Expected: PASS, 4 tests

- [ ] **Step 6: Verify types**

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean, 26 tests pass

- [ ] **Step 7: Commit**

```bash
git add src/components/dish
git commit -m "feat: port dish card and add-to-cart control"
```

---

## Task 10: Chef's Specials section

**Files:**
- Create: `src/components/sections/Specials.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `SPECIALS`, `DishCard`, `useReveal`, `RevealWords`
- Produces: `<Specials />`

Source: `legacy/index.html:437-465`.

- [ ] **Step 1: Implement Specials**

Create `src/components/sections/Specials.tsx`:

```tsx
import { SPECIALS } from "../../data/menu";
import { DishCard } from "../dish/DishCard";
import { useReveal } from "../../hooks/useReveal";
import { RevealWords } from "../ui/RevealWords";

export function Specials() {
  const eyebrowRef = useReveal<HTMLParagraphElement>();
  const leadRef = useReveal<HTMLParagraphElement>();
  const rowRef = useReveal<HTMLDivElement>();

  return (
    <section id="specials" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p
            ref={eyebrowRef}
            className="text-xs font-semibold uppercase tracking-widest text-[#C6973F]"
          >
            From the tandoor
          </p>
          <RevealWords
            as="h2"
            className="text-balance mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#3A1509]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Chef&apos;s Specials
          </RevealWords>
          <p ref={leadRef} className="mt-4 text-stone-500 leading-relaxed">
            Four dishes our head chef refuses to take off the menu — perfected
            over three generations.
          </p>
        </div>
        <div
          ref={rowRef}
          className="mt-12 grid grid-flow-col auto-cols-[85%] sm:auto-cols-[48%] lg:auto-cols-fr gap-5 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {SPECIALS.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

`RevealWords` types its child as `string`. JSX decodes `&apos;` in text children before it reaches the component, so `Chef&apos;s Specials` arrives as the string `Chef's Specials` and splits into two words, matching the original.

- [ ] **Step 2: Mount it**

In `src/App.tsx`, render `<Specials />` after `<Hero />`.

- [ ] **Step 3: Verify against the original**

Run: `npm run dev`

Confirm: 4 signature dishes appear (Butter Chicken, Dal Makhani, Lamb Rogan Josh, Saffron Kulfi); the row scrolls horizontally with snap below 1024px at 85% then 48% card width, and becomes an even 4-column flex row above; the scrollbar is hidden; each card shows the Signature badge and the correct veg dot colour.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Specials.tsx src/App.tsx
git commit -m "feat: port chef's specials section"
```

---

## Task 11: Menu section

**Files:**
- Create: `src/components/sections/Menu.tsx`, `src/components/sections/Menu.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `MENU_ITEMS`, `MENU_CATEGORIES`, `DishCard`, `useReveal`, `RevealWords`, `Icon`
- Produces: `<Menu />`

Source: `legacy/index.html:468-545` for the shell, `1414-1444` for tab and grid rendering.

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/Menu.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UIProvider } from "../../context/UIContext";
import { CartProvider } from "../../context/CartContext";
import { Menu } from "./Menu";

function renderMenu() {
  return render(
    <UIProvider>
      <CartProvider>
        <Menu />
      </CartProvider>
    </UIProvider>,
  );
}

describe("Menu", () => {
  it("shows all ten dishes under the All tab by default", () => {
    renderMenu();
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("10 dishes")).toBeInTheDocument();
  });

  it("filters to a category and updates the count note", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("tab", { name: "Starters" }));

    expect(screen.getByRole("tab", { name: "Starters" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("2 dishes")).toBeInTheDocument();
    expect(screen.getByText("Vegetable Samosa")).toBeInTheDocument();
    expect(screen.queryByText("Butter Chicken")).not.toBeInTheDocument();
  });

  it("reports the right count for every category", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("tab", { name: "Mains" }));
    expect(screen.getByText("4 dishes")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Breads & Rice" }));
    expect(screen.getByText("2 dishes")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Desserts" }));
    expect(screen.getByText("2 dishes")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "All" }));
    expect(screen.getByText("10 dishes")).toBeInTheDocument();
  });
});
```

Note: no current category contains exactly one dish, so the singular branch (`dish` rather than `dishes`) is not reachable through the UI and is not asserted. It is still implemented exactly as the original (`legacy/index.html:1443`) because adding a dish later could reach it.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/sections/Menu.test.tsx`
Expected: FAIL — cannot resolve `./Menu`

- [ ] **Step 3: Implement Menu**

Create `src/components/sections/Menu.tsx`:

```tsx
import { useState } from "react";
import { MENU_CATEGORIES, MENU_ITEMS, type CategoryId } from "../../data/menu";
import { DishCard } from "../dish/DishCard";
import { useReveal } from "../../hooks/useReveal";
import { RevealWords } from "../ui/RevealWords";
import { Icon } from "../ui/Icon";

type TabId = CategoryId | "all";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  ...MENU_CATEGORIES,
];

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<TabId>("all");
  const eyebrowRef = useReveal<HTMLParagraphElement>();
  const leadRef = useReveal<HTMLParagraphElement>();
  const legendRef = useReveal<HTMLDivElement>();
  const tabsRef = useReveal<HTMLDivElement>();

  const items =
    activeCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <section
      id="menu"
      className="py-20 sm:py-28"
      style={{ background: "linear-gradient(180deg, #f4ede1, #faf6ef)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p
            ref={eyebrowRef}
            className="text-xs font-semibold uppercase tracking-widest text-[#C6973F]"
          >
            The full spread
          </p>
          <RevealWords
            as="h2"
            className="text-balance mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#3A1509]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Explore Our Menu
          </RevealWords>
          <p ref={leadRef} className="mt-4 text-stone-500 leading-relaxed">
            Every dish is prepared fresh, with spices ground in-house each
            morning. Pick a category to browse.
          </p>
          <div
            ref={legendRef}
            className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-stone-500"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: "#3e8e5a",
                  boxShadow: "0 0 0 3px rgba(62, 142, 90, 0.15)",
                }}
              />
              Vegetarian
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: "#8b3a2e",
                  boxShadow: "0 0 0 3px rgba(139, 58, 46, 0.15)",
                }}
              />
              Non-Vegetarian
            </span>
            <span className="flex items-center gap-1.5">
              <Icon
                icon="solar:fire-linear"
                width={13}
                className="text-[#C6973F]"
              />
              Heritage signature
            </span>
          </div>
        </div>
        <div
          ref={tabsRef}
          className="mt-10 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Menu categories"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeCategory === tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={
                activeCategory === tab.id
                  ? { background: "#8B3A2E", color: "#FAF6EF" }
                  : { background: "rgba(139,58,46,.06)", color: "#57534E" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="mt-8 text-center text-xs font-medium uppercase tracking-widest text-stone-400">
          {items.length} dish{items.length === 1 ? "" : "es"}
        </p>
        <div
          className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-live="polite"
        >
          {items.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/sections/Menu.test.tsx`
Expected: PASS, 3 tests

- [ ] **Step 5: Mount and verify**

In `src/App.tsx`, render `<Menu />` after `<Specials />`.

Run: `npm run dev`

Confirm: 5 tabs; the active tab is filled heritage red; the grid is 1 / 2 / 3 columns at mobile / tablet / desktop; the count note updates; adding Butter Chicken from the Specials rail shows quantity 1 on the same dish in the Mains grid.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Menu.tsx src/components/sections/Menu.test.tsx src/App.tsx
git commit -m "feat: port menu section with category filtering"
```

---

## Task 12: About section

**Files:**
- Create: `src/components/sections/About.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useAboutUncover`, `GradientBorder`
- Produces: `<About />`

Source: `legacy/index.html:548-681`. Each `.about-uncover-item` carries a `--i` stagger index: image 0, eyebrow 0, heading 1, first paragraph 2, second paragraph 3, stat cards 4/5/6.

- [ ] **Step 1: Implement About**

Create `src/components/sections/About.tsx`:

```tsx
import { useAboutUncover } from "../../hooks/useAboutUncover";

const STAT_GRADIENT =
  "linear-gradient(135deg, rgba(198, 151, 63, 0.45), rgba(139, 58, 46, 0.1))";

const STATS = [
  { value: "37+", label: "Years serving", i: 4 },
  { value: "62", label: "Family recipes", i: 5 },
  { value: "4.9★", label: "Guest rating", i: 6 },
];

export function About() {
  const sectionRef = useAboutUncover<HTMLDivElement>();

  return (
    <section id="about" className="py-20 sm:py-28">
      <div
        ref={sectionRef}
        className="about-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
      >
        <div
          className="about-uncover-item rounded-3xl p-px order-2 lg:order-1 overflow-hidden"
          style={{
            "--i": 0,
            background:
              "linear-gradient(135deg, rgba(198, 151, 63, 0.6), rgba(139, 58, 46, 0.15), rgba(198, 151, 63, 0.4))",
          } as React.CSSProperties}
        >
          <img
            src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1400&auto=format&fit=crop"
            alt="A traditional Indian thali with assorted curries, breads and rice"
            className="about-uncover-img rounded-3xl w-full h-[420px] object-cover"
            loading="lazy"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p
            className="about-uncover-item text-xs font-semibold uppercase tracking-widest text-[#C6973F]"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            Our story
          </p>
          <h2
            className="about-uncover-item text-balance mt-3 text-3xl sm:text-4xl tracking-tight text-[#3A1509]"
            style={
              {
                fontFamily: "'Fraunces', serif",
                fontWeight: 500,
                "--i": 1,
              } as React.CSSProperties
            }
          >
            Three generations of one kitchen
          </h2>
          <p
            className="about-uncover-item mt-5 text-stone-500 leading-relaxed"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            In 1987, our grandmother opened a six-table eatery with nothing but
            her handwritten recipe book and a clay tandoor. Today, that same
            book still guides every dish we serve — from the eighteen-hour dal
            makhani to the saffron kulfi she churned by hand.
          </p>
          <p
            className="about-uncover-item mt-4 text-stone-500 leading-relaxed"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            We believe heritage isn&apos;t preserved in museums. It&apos;s
            preserved at the table, one shared meal at a time.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="about-uncover-item rounded-2xl p-px"
                style={
                  { "--i": stat.i, background: STAT_GRADIENT } as React.CSSProperties
                }
              >
                <div className="rounded-2xl bg-white px-2 sm:px-4 py-5 text-center">
                  <p
                    className="text-2xl tracking-tight text-[#8B3A2E]"
                    style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

Custom properties in React style objects need the `as React.CSSProperties` cast — TypeScript's `CSSProperties` does not permit arbitrary `--*` keys.

- [ ] **Step 2: Mount and verify**

In `src/App.tsx`, render `<About />` after `<Menu />`.

Run: `npm run dev`

Scroll to About and confirm: the image and text stack with the image second on mobile and first at ≥1024px; on entry, items uncover top-to-bottom with a clip-path sweep staggered 85ms apart, and the image settles from 1.06 scale; with `prefers-reduced-motion: reduce` the content is visible with no animation.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.tsx src/App.tsx
git commit -m "feat: port about section with clip-path uncover"
```

---

## Task 13: Contact section

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useReveal`, `RevealWords`, `Icon`
- Produces: `<Contact />`

Source: `legacy/index.html:684-824`. Two `data-reveal` elements: the info card wrapper (706) and the map wrapper (800).

- [ ] **Step 1: Implement Contact**

Create `src/components/sections/Contact.tsx`:

```tsx
import { useReveal } from "../../hooks/useReveal";
import { RevealWords } from "../ui/RevealWords";
import { Icon } from "../ui/Icon";

const CARD_GRADIENT =
  "linear-gradient(135deg, rgba(198, 151, 63, 0.5), rgba(139, 58, 46, 0.12), rgba(198, 151, 63, 0.35))";

const ICON_TILE =
  "w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-[#8B3A2E]";

export function Contact() {
  const eyebrowRef = useReveal<HTMLParagraphElement>();
  const infoRef = useReveal<HTMLDivElement>();
  const mapRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="contact"
      className="py-20 sm:py-28"
      style={{ background: "linear-gradient(180deg, #f4ede1, #faf6ef)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p
            ref={eyebrowRef}
            className="text-xs font-semibold uppercase tracking-widest text-[#C6973F]"
          >
            Visit us
          </p>
          <RevealWords
            as="h2"
            className="text-balance mt-3 text-3xl sm:text-4xl tracking-tight text-[#3A1509]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Find Your Table
          </RevealWords>
        </div>
        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          <div
            ref={infoRef}
            className="rounded-3xl p-px"
            style={{ background: CARD_GRADIENT }}
          >
            <div className="rounded-3xl bg-white p-7 sm:p-9 h-full">
              <ul className="space-y-6 text-sm">
                <li className="flex gap-4">
                  <span
                    className={ICON_TILE}
                    style={{ background: "rgba(139, 58, 46, 0.08)" }}
                  >
                    <Icon icon="solar:map-point-linear" width={20} />
                  </span>
                  <span>
                    <strong className="block font-semibold text-stone-800">
                      Address
                    </strong>
                    <span className="text-stone-500">
                      42 Spice Lane, Old Town District, ST 10021
                    </span>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span
                    className={ICON_TILE}
                    style={{ background: "rgba(139, 58, 46, 0.08)" }}
                  >
                    <Icon icon="solar:phone-linear" width={20} />
                  </span>
                  <span>
                    <strong className="block font-semibold text-stone-800">
                      Phone
                    </strong>
                    <a
                      href="tel:+15551234567"
                      className="text-stone-500 hover:text-[#8B3A2E] transition-colors"
                    >
                      (555) 123-4567
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span
                    className={ICON_TILE}
                    style={{ background: "rgba(139, 58, 46, 0.08)" }}
                  >
                    <Icon icon="solar:letter-linear" width={20} />
                  </span>
                  <span>
                    <strong className="block font-semibold text-stone-800">
                      Email
                    </strong>
                    <a
                      href="mailto:hello@bombayheritage.com"
                      className="text-stone-500 hover:text-[#8B3A2E] transition-colors"
                    >
                      hello@bombayheritage.com
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span
                    className={ICON_TILE}
                    style={{ background: "rgba(139, 58, 46, 0.08)" }}
                  >
                    <Icon icon="solar:clock-circle-linear" width={20} />
                  </span>
                  <span>
                    <strong className="block font-semibold text-stone-800">
                      Hours
                    </strong>
                    <span className="text-stone-500">
                      Mon–Sun · 11:30 AM – 10:30 PM
                      <br />
                      Kitchen closes at 10:00 PM
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div
            ref={mapRef}
            className="rounded-3xl p-px"
            style={{ background: CARD_GRADIENT }}
          >
            <iframe
              title="Map to Bombay Heritage restaurant"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.7!2d72.8258!3d18.9220!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU1JzE5LjIiTiA3MsKwNDknMzIuOSJF!5e0!3m2!1sen!2sus!4v1700000000000"
              className="rounded-3xl w-full h-full min-h-[360px]"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

The `–` in "Mon–Sun" is an en dash (U+2013) and `·` is a middle dot (U+00B7) — copy from `legacy/index.html:792`.

- [ ] **Step 2: Mount and verify**

In `src/App.tsx`, render `<Contact />` after `<About />`.

Run: `npm run dev`

Confirm: the info card and map stack below 1024px and sit side by side above; the map keeps its 360px minimum height; the phone and email links are clickable.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.tsx src/App.tsx
git commit -m "feat: port contact section"
```

---

## Task 14: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useUI` (for `showToast`), `Icon`
- Produces: `<Footer />`

Source: `legacy/index.html:827-994`. The newsletter form fires a toast and does nothing else (`legacy/index.html:943-946`).

- [ ] **Step 1: Implement Footer**

Create `src/components/layout/Footer.tsx`:

```tsx
import type { FormEvent } from "react";
import { useUI } from "../../context/UIContext";
import { Icon } from "../ui/Icon";

const SOCIALS = [
  { label: "Instagram", icon: "solar:camera-linear" },
  { label: "Facebook", icon: "solar:users-group-rounded-linear" },
  { label: "Twitter", icon: "solar:chat-round-line-linear" },
];

const QUICK_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#specials", label: "Chef's Specials" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const { showToast } = useUI();

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast("You're on the list. Welcome!");
  };

  return (
    <footer
      className="text-stone-400"
      style={{
        background: "#231008",
        borderTop: "1px solid transparent",
        borderImage:
          "linear-gradient(90deg, rgba(198, 151, 63, 0.05), rgba(198, 151, 63, 0.5), rgba(198, 151, 63, 0.05)) 1",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#FAF6EF]"
              style={{ background: "linear-gradient(135deg, #8b3a2e, #5e2318)" }}
            >
              <Icon icon="solar:fire-linear" width={18} />
            </span>
            <span
              className="brand-lockup text-lg tracking-tight text-[#FAF6EF]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Bombay Heritage
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Slow-cooked heritage recipes, hand-ground spices, and the warmth of
            an Indian family table — since 1987.
          </p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:text-[#E8C87E] transition-colors"
                style={{ border: "1px solid rgba(250, 246, 239, 0.15)" }}
              >
                <Icon icon={social.icon} width={17} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#FAF6EF]">Quick links</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-[#E8C87E] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#FAF6EF]">
            Get seasonal specials
          </p>
          <form className="mt-4 flex gap-2" onSubmit={handleSubscribe}>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div
              className="w-full rounded-full p-px"
              style={{
                background:
                  "linear-gradient(135deg, rgba(198, 151, 63, 0.6), rgba(250, 246, 239, 0.1), rgba(198, 151, 63, 0.35))",
              }}
            >
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-full px-4 py-2.5 text-sm text-[#FAF6EF] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#C6973F]/50"
                style={{ background: "#231008" }}
              />
            </div>
            <button
              type="submit"
              aria-label="Subscribe"
              className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-[#3A1509] transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #e8c87e, #c6973f)" }}
            >
              <Icon icon="solar:arrow-right-linear" width={18} />
            </button>
          </form>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs flex flex-col sm:flex-row justify-between gap-2"
        style={{ borderTop: "1px solid rgba(250, 246, 239, 0.1)" }}
      >
        <span>© 2025 Bombay Heritage. All rights reserved.</span>
        <span>Crafted with cardamom &amp; care.</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Mount and verify**

In `src/App.tsx`, render `<Footer />` after `<Contact />`, still inside `<main id="main-view">` — the original nests the footer inside `main` (`legacy/index.html:827` sits before the closing `</main>` at 995). Match that.

Run: `npm run dev`

Confirm: the top border shows the saffron gradient fading at both ends; the layout is 4 columns at ≥768px with the brand block spanning 2; submitting the newsletter shows the toast and does not navigate.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx src/App.tsx
git commit -m "feat: port footer with newsletter form"
```

---

## Task 15: Cart drawer

**Files:**
- Create: `src/hooks/useBodyScrollLock.ts`, `src/hooks/useFocusTrap.ts`, `src/components/cart/CartDrawer.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useUI`, `useCart`, `MENU_ITEMS`, `money`, `Icon`
- Produces:
  - `useBodyScrollLock(isOpen: boolean): void`
  - `useFocusTrap(ref: React.RefObject<HTMLElement | null>, isOpen: boolean, onClose: () => void): void`
  - `<CartDrawer />`

Source: `legacy/index.html:998-1076` for markup, `1601-1646` for the item list, `1648-1732` for focus and scroll behaviour.

- [ ] **Step 1: Implement the scroll lock**

Create `src/hooks/useBodyScrollLock.ts`. The module-level counter reproduces `openOverlayCount` (`legacy/index.html:1649-1661`) so closing one overlay does not unlock scrolling while another is still open.

```ts
import { useEffect } from "react";

let openOverlayCount = 0;

export function useBodyScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;
    openOverlayCount++;
    document.body.classList.add("overflow-hidden");
    return () => {
      openOverlayCount = Math.max(0, openOverlayCount - 1);
      if (openOverlayCount === 0) {
        document.body.classList.remove("overflow-hidden");
      }
    };
  }, [isOpen]);
}
```

- [ ] **Step 2: Implement the focus trap**

Create `src/hooks/useFocusTrap.ts`. From `legacy/index.html:1663-1703`, plus focus restoration from 1706 and 1731.

```ts
import { useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const container = ref.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [ref, isOpen, onClose]);
}
```

The original prioritises the auth view over the cart when both are open. Attaching the listener per-open-overlay reproduces this: the auth modal mounts later in the tree, so its listener is added last and its Escape handler runs after the drawer's. Because both call their own `onClose`, closing both at once is possible where the original closed only auth. To match exactly, `CartDrawer` skips its Escape handling while `authMode !== null` — pass `isOpen={cartOpen && authMode === null}` to `useFocusTrap` and keep the drawer rendered on `cartOpen`.

- [ ] **Step 3: Implement CartDrawer**

Create `src/components/cart/CartDrawer.tsx`:

```tsx
import { useEffect, useRef } from "react";
import { useUI } from "../../context/UIContext";
import { useCart } from "../../context/CartContext";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { MENU_ITEMS } from "../../data/menu";
import { money } from "../../lib/money";
import { Icon } from "../ui/Icon";

export function CartDrawer() {
  const { cartOpen, closeCart, authMode, showToast } = useUI();
  const { items, subtotal, setQty } = useCart();
  const drawerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useBodyScrollLock(cartOpen);
  useFocusTrap(drawerRef, cartOpen && authMode === null, closeCart);

  useEffect(() => {
    if (cartOpen) closeButtonRef.current?.focus();
  }, [cartOpen]);

  const entries = Object.entries(items);
  const isEmpty = entries.length === 0;

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity ${
          cartOpen ? "" : "hidden opacity-0"
        }`}
      />
      <aside
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[65] h-full w-full max-w-md transition-transform duration-300 p-0 sm:p-3 ${
          cartOpen ? "" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div
          className="h-full rounded-none sm:rounded-3xl p-px"
          style={{
            background:
              "linear-gradient(160deg, rgba(198, 151, 63, 0.65), rgba(139, 58, 46, 0.15), rgba(198, 151, 63, 0.45))",
          }}
        >
          <div
            className="h-full rounded-none sm:rounded-3xl bg-[#FAF6EF] flex flex-col"
            style={{ boxShadow: "0 25px 60px -15px rgba(58, 21, 9, 0.35)" }}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(139, 58, 46, 0.1)" }}
            >
              <h2
                className="text-xl tracking-tight text-[#3A1509]"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              >
                Your Order
              </h2>
              <button
                ref={closeButtonRef}
                onClick={closeCart}
                aria-label="Close cart"
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 hover:bg-[#8B3A2E]/10 transition-colors"
              >
                <Icon icon="solar:close-circle-linear" width={20} />
              </button>
            </div>
            <div
              className={`flex-1 overflow-y-auto px-6 py-5 space-y-4 ${
                isEmpty ? "flex flex-col items-center justify-center" : ""
              }`}
            >
              {isEmpty ? (
                <div className="text-center">
                  <Icon
                    icon="solar:cart-large-2-linear"
                    width={34}
                    className="text-stone-300"
                  />
                  <p className="mt-3 text-sm text-stone-400">
                    Your cart is empty.
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    Add a dish from the menu to get started.
                  </p>
                </div>
              ) : (
                entries.map(([id, qty]) => {
                  const item = MENU_ITEMS.find((i) => i.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-500 tabular-nums">
                          {money(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQty(id, -1)}
                          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#8B3A2E]/10 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-sm w-4 text-center tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(id, 1)}
                          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#8B3A2E]/10 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div
              className="px-6 py-5"
              style={{ borderTop: "1px solid rgba(139, 58, 46, 0.1)" }}
            >
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800 tabular-nums">
                  {money(subtotal)}
                </span>
              </div>
              <button
                onClick={() =>
                  showToast("Order placed! The tandoor is already hot. (demo)")
                }
                className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-[#FAF6EF] transition-transform hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #8b3a2e, #5e2318)",
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
```

The overlay uses `hidden opacity-0` together when closed. The original delays adding `hidden` by 300ms so the fade is visible (`legacy/index.html:1726-1729`); with both classes applied at once the fade-out is skipped. If the difference is noticeable during verification, add a local `visible` state that clears 300ms after `cartOpen` goes false and drive `hidden` from that.

The `−` is U+2212 — copy from `legacy/index.html:1631`.

- [ ] **Step 4: Mount and verify**

In `src/App.tsx`, render `<CartDrawer />` after `</main>`, before `<Toast />`.

Run: `npm run dev`

Confirm: adding a dish flies the image into the navbar cart along an arc, the badge holds then pops, and the cart icon dips; the drawer slides in over 300ms; the empty state centres; quantity changes update the subtotal; Escape and the overlay both close it; Tab cycles within the drawer; the page behind does not scroll while open.

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean, 29 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/hooks src/components/cart src/App.tsx
git commit -m "feat: port cart drawer with focus trap and scroll lock"
```

---

## Task 16: Auth modal

**Files:**
- Create: `src/components/auth/AuthModal.tsx`, `src/components/auth/AuthModal.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useUI`, `useBodyScrollLock`, `useFocusTrap`, `Icon`
- Produces: `<AuthModal />`

Source: `legacy/index.html:1079-1229` for markup, `1757-1788` for the login/signup copy swap.

- [ ] **Step 1: Write the failing test**

Create `src/components/auth/AuthModal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UIProvider, useUI } from "../../context/UIContext";
import { AuthModal } from "./AuthModal";

function Harness() {
  const { openAuth } = useUI();
  return (
    <>
      <button onClick={() => openAuth("login")}>open</button>
      <AuthModal />
    </>
  );
}

function renderAuth() {
  return render(
    <UIProvider>
      <Harness />
    </UIProvider>,
  );
}

describe("AuthModal", () => {
  it("is not rendered until opened", () => {
    renderAuth();
    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
  });

  it("opens in login mode with the name field hidden", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByText("open"));

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign In" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
  });

  it("switches to signup mode and reveals the name field", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByText("open"));
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(
      screen.getByText("Join us for faster checkout and seasonal specials."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("closes on the back button", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByText("open"));
    await user.click(screen.getByRole("button", { name: /Back to site/i }));

    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/auth/AuthModal.test.tsx`
Expected: FAIL — cannot resolve `./AuthModal`

- [ ] **Step 3: Implement AuthModal**

Create `src/components/auth/AuthModal.tsx`:

```tsx
import { useEffect, useRef, type FormEvent } from "react";
import { useUI } from "../../context/UIContext";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Icon } from "../ui/Icon";

const FIELD_CLASS =
  "w-full rounded-xl px-4 py-3 text-sm border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#8B3A2E]/40 focus:border-[#8B3A2E]";
const LABEL_CLASS =
  "block text-xs font-medium uppercase tracking-widest text-stone-500 mb-1.5";

export function AuthModal() {
  const { authMode, closeAuth, toggleAuthMode, showToast } = useUI();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const isOpen = authMode !== null;
  const isLogin = authMode === "login";

  useBodyScrollLock(isOpen);
  useFocusTrap(containerRef, isOpen, closeAuth);

  useEffect(() => {
    if (isOpen) emailRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = isLogin ? "Signed in. (demo)" : "Account created. (demo)";
    closeAuth();
    showToast(message);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#FAF6EF]"
      role="dialog"
      aria-modal="true"
      aria-label="Login or sign up"
    >
      <div className="min-h-full grid lg:grid-cols-2">
        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d3?q=80&w=1600&auto=format&fit=crop"
            alt="Tandoori skewers grilling over open flame"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(24, 10, 6, 0.85), rgba(24, 10, 6, 0.25))",
            }}
          />
          <div className="absolute bottom-0 p-12 text-[#FAF6EF]">
            <span className="flex items-center gap-2.5 mb-5">
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #8b3a2e, #5e2318)",
                }}
              >
                <Icon icon="solar:fire-linear" width={18} />
              </span>
              <span
                className="brand-lockup text-lg tracking-tight"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              >
                Bombay Heritage
              </span>
            </span>
            <p
              className="text-3xl tracking-tight leading-snug max-w-md"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              &quot;A meal shared is a memory made. Come make one with us.&quot;
            </p>
            <p className="mt-3 text-sm text-stone-300">
              — Chef Meera Kapoor, Head of Kitchen
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center px-4 sm:px-8 py-12">
          <div className="w-full max-w-md">
            <button
              onClick={closeAuth}
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-[#8B3A2E] transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" width={16} />
              Back to site
            </button>
            <h1
              className="text-3xl tracking-tight text-[#3A1509]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              {isLogin
                ? "Sign in to track your orders and save your favourites."
                : "Join us for faster checkout and seasonal specials."}
            </p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="auth-name" className={LABEL_CLASS}>
                    Full name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Jane Doe"
                    className={FIELD_CLASS}
                  />
                </div>
              )}
              <div>
                <label htmlFor="auth-email" className={LABEL_CLASS}>
                  Email
                </label>
                <input
                  ref={emailRef}
                  id="auth-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label htmlFor="auth-password" className={LABEL_CLASS}>
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className={FIELD_CLASS}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full py-3.5 text-sm font-semibold text-[#FAF6EF] transition-transform hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #8b3a2e, #5e2318)",
                }}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500">
              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>{" "}
              <button
                onClick={toggleAuthMode}
                className="font-semibold text-[#8B3A2E] hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

The original keeps the modal in the DOM and toggles `hidden`; conditionally rendering it is equivalent visually (there is no open/close transition on this overlay) and makes the focus effect straightforward.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/auth/AuthModal.test.tsx`
Expected: PASS, 4 tests

- [ ] **Step 5: Mount and verify**

In `src/App.tsx`, render `<AuthModal />` after `<CartDrawer />`.

Run: `npm run dev`

Confirm: "Login / Sign Up" opens the full-screen view; the photo panel appears only at ≥1024px; email is focused on open; toggling swaps every piece of copy and reveals the name field; Escape closes; submitting closes and shows the demo toast; the page behind does not scroll.

- [ ] **Step 6: Full verification pass**

Run: `npx tsc --noEmit && npx vitest run && npm run build`
Expected: clean type check, 33 tests pass, successful build

- [ ] **Step 7: Commit**

```bash
git add src/components/auth src/App.tsx
git commit -m "feat: port auth modal with login/signup toggle"
```

---

## Task 17: Token rename pass

**Files:**
- Modify: `src/index.css`, every file under `src/components/`

**Interfaces:**
- Consumes: nothing new
- Produces: `@theme` tokens usable as Tailwind utilities

This is the second pass described in the spec. Do it only after Task 16 is verified — the whole point is that any visual drift here is attributable to the rename alone.

- [ ] **Step 1: Confirm the pre-rename state is good**

Run: `npm run dev`

Walk the full page against `legacy/index.html` one more time. Do not proceed until it matches.

- [ ] **Step 2: Declare the tokens**

In `src/index.css`, insert directly after `@import "tailwindcss";`:

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

- [ ] **Step 3: Apply the class mapping**

Across all files under `src/components/`, replace exactly these class substrings. The hex is case-insensitive in the source — check for both `#8B3A2E` and `#8b3a2e`.

| Find | Replace |
|------|---------|
| `bg-[#8B3A2E]` | `bg-heritage` |
| `text-[#8B3A2E]` | `text-heritage` |
| `bg-[#8B3A2E]/10` | `bg-heritage/10` |
| `focus:ring-[#8B3A2E]/40` | `focus:ring-heritage/40` |
| `focus:ring-[#8B3A2E]/50` | `focus:ring-heritage/50` |
| `focus:border-[#8B3A2E]` | `focus:border-heritage` |
| `hover:text-[#8B3A2E]` | `hover:text-heritage` |
| `hover:bg-[#8B3A2E]/10` | `hover:bg-heritage/10` |
| `text-[#5E2318]` | `text-heritage-deep` |
| `text-[#C6973F]` | `text-saffron` |
| `focus:ring-[#C6973F]/50` | `focus:ring-saffron/50` |
| `text-[#E8C87E]` | `text-saffron-light` |
| `hover:text-[#E8C87E]` | `hover:text-saffron-light` |
| `text-[#3A1509]` | `text-cacao` |
| `bg-[#FAF6EF]` | `bg-surface` |
| `text-[#FAF6EF]` | `text-surface` |

Also update `index.html`'s body class: `bg-[#FAF6EF]` → `bg-surface`.

- [ ] **Step 4: Apply the font mapping**

Replace every occurrence of the inline font style with utility classes:

- `style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}` → delete the style prop, add `font-display font-medium` to `className`
- `style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}` → delete the style prop, add `font-display font-semibold` to `className`

Where the style object holds other properties too (`About.tsx`'s heading carries `--i`), keep the object and remove only the two font keys.

In `index.html`, replace the body's inline `style="font-family: 'Inter', sans-serif"` with `font-body` in the class list.

- [ ] **Step 5: Verify nothing was missed**

Run: `npx tsc --noEmit`
Expected: clean

Run the following and confirm the only remaining brand hexes are inside `src/index.css`, `src/lib/flyToCart.ts` (the flight's box-shadow), and one-off gradient strings:

```bash
grep -rn "#8B3A2E\|#8b3a2e\|#FAF6EF\|#C6973F\|#E8C87E\|#3A1509\|#5E2318" src/ index.html
```

Expected remaining: `src/index.css` (`@theme` and the `.cart-ctl` gradient), gradient strings in components (`linear-gradient(135deg, #8b3a2e, #5e2318)` and similar), and `src/lib/flyToCart.ts`. Any bare `bg-[#...]` or `text-[#...]` utility left over is a miss — fix it.

- [ ] **Step 6: Visual regression check**

Run: `npm run dev`

Compare against `legacy/index.html` at 375px, 768px, and 1440px. Every colour must be unchanged. If anything shifted, the mapping table was applied wrongly — `git diff` the rename commit to find it.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: replace arbitrary brand hex values with design tokens"
```

---

## Task 18: Deployment

**Files:**
- Modify: `.github/workflows/static.yml`
- Create: `README.md` content

**Interfaces:**
- Consumes: `npm run build` producing `dist/`
- Produces: a Pages deployment of the built app

- [ ] **Step 1: Update the workflow**

Replace the `deploy` job's steps in `.github/workflows/static.yml`. Everything above `jobs:` stays as-is.

```yaml
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Update the README**

Replace `README.md`:

```markdown
# Bombay Heritage

A single-page restaurant site — menu, chef's specials, story, cart, and a
front-end-only checkout and auth flow.

## Development

```bash
npm install
npm run dev
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the unit tests |

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, GSAP ScrollTrigger, Iconify.

## Notes

`legacy/index.html` is the original single-file version of this site, kept as
the visual reference for the React port. It is not part of the build.

Cart, login/signup, and checkout are UI only — there is no backend, payment
processing, or order fulfilment. All content is placeholder.
```

- [ ] **Step 3: Final full verification**

Run: `npm ci && npm run build && npx vitest run`
Expected: clean install, successful build, 33 tests pass

Run: `npm run preview`

Open the preview URL and walk the entire checklist from the spec's Verification section: all seven sections at three widths, menu filtering, fly-to-cart, badge hold and pop, cart-catch dip, pill morph, digit roll, arming delay, cross-section quantity sync, drawer and modal open/close/Escape/focus-trap/scroll-lock, auth toggle, all four toasts, scroll reveals, word stagger, About uncover, and reduced-motion behaviour.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/static.yml README.md
git commit -m "chore: build and deploy the React app to GitHub Pages"
```

- [ ] **Step 5: Push and confirm the deployment**

```bash
git push origin main
```

Watch the Actions run. Confirm the deployed URL renders the site with assets loading (relative `base: "./"` paths) and icons appearing.

---

## Self-Review Notes

**Spec coverage:** Every spec section maps to a task — data (2), state (4, 5), view (7–16), the `GradientBorder`/`RevealWords`/`Icon` component notes (6, 9), fly-to-cart (5, 9), overlays (15, 16), styling and tokens (1, 17), build and deployment (1, 18), verification (18).

**Known deviations from the original, all deliberate and noted inline:**
- `cartSubtotal` skips unknown ids instead of throwing (Task 3).
- The cart overlay's 300ms fade-out is collapsed, with a remedy given if it shows (Task 15).
- The auth modal unmounts instead of toggling `hidden` (Task 16).
- Escape precedence between drawer and modal is reproduced via the `authMode === null` guard (Task 15).

**Not covered by tests, verified manually only:** every animation, all responsive behaviour, and all colour fidelity. This is intentional — the spec's verification section treats side-by-side comparison against `legacy/index.html` as the primary check, and screenshot-diff infrastructure is out of scope.
