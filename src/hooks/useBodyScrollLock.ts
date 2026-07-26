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
