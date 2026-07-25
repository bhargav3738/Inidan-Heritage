---
version: "alpha"
name: "Bombay Heritage — Authentic Indian Cuisine"
description: "Bombay Heritage Login Section is designed for authenticating users through a focused access flow. Key features include reusable structure, responsive behavior, and production-ready presentation. It is suitable for authentication screens in web products."
colors:
  primary: "#8B3A2E"
  secondary: "#C6973F"
  tertiary: "#3E8E5A"
  neutral: "#57534E"
  background: "#8B3A2E"
  surface: "#FAF6EF"
  text-primary: "#57534E"
  text-secondary: "#44403C"
  border: "#C6973F"
  accent: "#8B3A2E"
typography:
  display-lg:
    fontFamily: "Fraunces"
    fontSize: "72px"
    fontWeight: 500
    lineHeight: "72px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
rounded:
  md: "0px"
  full: "9999px"
spacing:
  base: "4px"
  sm: "1px"
  md: "4px"
  lg: "6px"
  xl: "8px"
  gap: "6px"
  card-padding: "11px"
  section-padding: "32px"
components:
  button-secondary:
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "14px"
  button-link:
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "0px"
---

## Overview

Bombay Heritage is a premium visual system that balances ancestral Indian tradition with modern culinary elegance. The mood is defined by "warm spice and heritage parchment"—utilizing a warm, off-white canvas to let rich, deep-toned photography and spice-inspired accents stand out. The design logic follows a high-end editorial approach, combining classic serif typography with modern glassmorphism and subtle gradient-border techniques to create a sense of tactile luxury.

- **Mood:** Preserve a bombay, heritage, premium, visual, system, balances tone rather than defaulting to a generic SaaS look.

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses light mode with #8B3A2E as the main accent and #57534E as the neutral foundation.

- **Primary (#8B3A2E):** Main accent and emphasis color.
- **Secondary (#C6973F):** Supporting accent for secondary emphasis.
- **Tertiary (#3E8E5A):** Reserved accent for supporting contrast moments.
- **Neutral (#57534E):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #8B3A2E; Surface: #FAF6EF; Text Primary: #57534E; Text Secondary: #44403C; Border: #C6973F; Accent: #8B3A2E

## Typography

Typography pairs Fraunces for display hierarchy with Inter for supporting content and interface copy.

- **Display (`display-lg`):** Fraunces, 72px, weight 500, line-height 72px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 16px, weight 400, line-height 26px.
- **Labels (`label-md`):** Inter, 14px, weight 500, line-height 20px.

## Layout

• Container: Max-width 7xl (1280px) with responsive horizontal padding (px-4 to px-8).
• Section Rhythm: Generous vertical spacing (py-20 to py-28) creates a rhythmic, unhurried pace suitable for a fine-dining experience.
• Grid Logic:
  - Menu: Responsive 1-column (mobile) to 3-column (desktop) grid with 20px (gap-5) spacing.
  - Specials: A horizontal "snap-mandatory" scroll row for mobile/tablet, transitioning to a flexible flex-row on desktop.
• Navbar: Fixed, high-z-index (z-50) header with a 16px (h-16) height and backdrop-filter blur for content persistence.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 1px, 4px, 6px, 8px, 10px, 12px, 14px, 16px
- **Section padding:** 32px, 112px
- **Card padding:** 11px, 13px, 18px
- **Gaps:** 6px, 8px, 10px, 12px

## Elevation & Depth

• Surface Recipe: Multi-layered depth achieved through 85% opacity backgrounds (#FAF6EF) combined with a 12px backdrop-filter blur on navigation and overlays.
• Gradient Borders: Reusable "p-px" pattern where a 1px padding container with a linear-gradient (Saffron-to-Transparent) wraps an inner white or dark-cacao card, creating a shimmering, metallic edge.
• Shadows: Subtle, large-radius shadows (0 25px 60px -15px) used specifically for top-layer elements like the cart drawer to separate them from the main view.
• Textures: Semi-transparent overlays on hero images using a right-to-left linear gradient (rgba(24,10,6,.88) to transparent) to ensure text legibility over photography.

• Radius Hierarchy:
  - Primary Cards/Images: 24px (rounded-3xl) for a soft, premium feel.
  - Secondary Components: 16px (rounded-2xl) for smaller info boxes and stats.
  - Interactive/UI: Full-circle (rounded-full) for buttons, icon containers, and navigation chips.
• Icon Geometry: Solar Linear style icons with a consistent 1.5px stroke width to match the weight of Inter typography.

• Navigation Chips: Rounded-full pills used for menu categories with active/inactive states signaled by subtle background shifts.
• Dish Cards: Image-led containers featuring a gradient-border wrapper, title in Fraunces, and price/meta in Inter.
• Action Buttons: Gradient-filled capsules (Heritage Red or Saffron) with a hover-state scale-up effect (scale-[1.03]).
• Drawer System: A right-aligned, full-height overlay for the cart, utilizing the standard 24px corner radius and gradient-border wrapper.
• Stat Badges: Small 3-column grid components with a light background and 16px radius for displaying brand trust metrics (Years, Recipes, Ratings).

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #C6973F; 1px #FAF6EF
- **Shadows:** rgba(62, 142, 90, 0.15) 0px 0px 0px 3px; rgba(139, 58, 46, 0.15) 0px 0px 0px 3px
- **Blur:** 12px, 8px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 16px radius. Drive the shell with linear-gradient(135deg, rgba(198, 151, 63, 0.5), rgba(250, 246, 239, 0.08), rgba(198, 151, 63, 0.35)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 8px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 8px, 16px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Secondary:** text #FAF6EF, radius 9999px, padding 14px, border 1px solid rgba(250, 246, 239, 0.3).
- **Links:** text #57534E, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 8px, 16px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

• Reveal Logic: Use staggered text reveals (data-reveal-words) for headlines to mimic the "unfolding" of a menu. • Layout Transitions: 300ms duration for all CSS-based transitions (hover, mobile menu toggle, and cart drawer). • Scroll Behavior: Smooth-scroll to anchors with ScrollTrigger-based entry animations for all major sections to create a "reveal-on-scroll" experience. • Micro-interactions: Subtle scale transforms (1.03x) on button hover and cart badge updates to provide tactile feedback. • Navigation: The navbar should transition background opacity or border-color on scroll to remain distinct from the page content.

**Motion Level:** moderate

**Durations:** 150ms, 300ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1)

**Hover Patterns:** color, text, transform

**Scroll Patterns:** gsap-scrolltrigger
