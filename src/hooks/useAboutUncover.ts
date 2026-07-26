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
