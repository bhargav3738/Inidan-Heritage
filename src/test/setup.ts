import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom does not implement matchMedia. GSAP's ScrollTrigger calls it at import
// time, and flyToCart calls it to honour prefers-reduced-motion. `matches: false`
// is the honest default for a headless environment: it reports "no reduced-motion
// preference", the same as a default browser, so code under test takes its normal
// path rather than the reduced-motion shortcut.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

afterEach(() => {
  cleanup();
});
