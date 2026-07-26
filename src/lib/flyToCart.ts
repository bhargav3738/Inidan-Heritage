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
