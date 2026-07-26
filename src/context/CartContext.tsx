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
