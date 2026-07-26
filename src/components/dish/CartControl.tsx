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
          className="w-full h-full inline-flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold text-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heritage/50"
        >
          <Icon icon="solar:cart-plus-linear" width={14} /> Add
        </button>
      </div>
      <div className="cart-ctl-face cart-ctl-qty px-1">
        <button
          type="button"
          onClick={() => setQty(item.id, -1)}
          aria-label={`Remove one ${item.name} from cart`}
          className="w-8 h-8 shrink-0 rounded-full inline-flex items-center justify-center text-sm text-surface hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          −
        </button>
        <span
          key={qty}
          className="cart-ctl-num is-rolling flex-1 text-center text-xs font-semibold text-surface tabular-nums"
        >
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty(item.id, 1)}
          aria-label={`Add one more ${item.name} to cart`}
          className="w-8 h-8 shrink-0 rounded-full inline-flex items-center justify-center text-sm text-surface hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          +
        </button>
      </div>
    </div>
  );
}
