import { useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* The original kept ONE module-wide `lastFocusedEl`, written by both openCart
   and openAuth and read by both closeCart and closeAuth
   (legacy/index.html:1705, 1735-1748). Opening auth over an open cart therefore
   overwrote the slot with whatever inside the drawer had focus, so closing auth
   returned focus into the drawer. A per-hook captured element cannot reproduce
   that, so the slot is shared here too. */
let lastFocusedEl: HTMLElement | null = null;

export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
  /* Whether the Escape/Tab trap is armed. Separate from `isOpen` because the
     cart drawer stays open (and keeps owning the focus-restore slot) while the
     auth modal is layered over it with the trap handed off. */
  isTrapActive: boolean = isOpen,
) {
  // Focus capture/restore is tied to the overlay being open, NOT to the trap
  // being armed — disarming must not restore focus, or layering auth over the
  // cart would yank focus out of the still-open drawer.
  useEffect(() => {
    if (!isOpen) return;
    lastFocusedEl = document.activeElement as HTMLElement | null;
    return () => {
      lastFocusedEl?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isTrapActive) return;

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
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ref, isTrapActive, onClose]);
}
