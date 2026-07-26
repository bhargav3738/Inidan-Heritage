import { useEffect, useRef, useState } from "react";
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

  // Mirrors the original's setTimeout(..., 300) before re-adding `hidden`
  // (legacy/index.html:1726-1729), so the overlay fade-out is visible
  // instead of disappearing on the same frame `opacity-0` is applied.
  const [overlayVisible, setOverlayVisible] = useState(cartOpen);
  useEffect(() => {
    if (cartOpen) {
      setOverlayVisible(true);
      return;
    }
    const timer = setTimeout(() => setOverlayVisible(false), 300);
    return () => clearTimeout(timer);
  }, [cartOpen]);

  const entries = Object.entries(items);
  const isEmpty = entries.length === 0;

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity ${
          cartOpen ? "" : "opacity-0"
        } ${overlayVisible ? "" : "hidden"}`}
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
            className="h-full rounded-none sm:rounded-3xl bg-surface flex flex-col"
            style={{ boxShadow: "0 25px 60px -15px rgba(58, 21, 9, 0.35)" }}
          >
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(139, 58, 46, 0.1)" }}
            >
              <h2
                className="text-xl tracking-tight text-cacao font-display font-semibold"
              >
                Your Order
              </h2>
              <button
                ref={closeButtonRef}
                onClick={closeCart}
                aria-label="Close cart"
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 hover:bg-heritage/10 transition-colors"
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
                          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-heritage/10 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-sm w-4 text-center tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(id, 1)}
                          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-heritage/10 transition-colors"
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
                className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-surface transition-transform hover:scale-[1.02]"
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
