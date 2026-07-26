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
  const catchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  // Ids whose "first add" side effects (flight + toast) have fired but whose
  // setItems has not committed yet. Reading `items` alone cannot tell a genuine
  // first add from a second click inside the same React batch, and reading it
  // inside the setItems updater fires the side effects twice under StrictMode.
  const inFlight = useRef<Set<string>>(new Set());
  const { showToast } = useUI();

  const count = cartCount(items);
  const displayCount = heldCount ?? count;
  const subtotal = useMemo(() => cartSubtotal(items, MENU_ITEMS), [items]);

  // Once an add has committed, the id is a normal cart member again — drop it so
  // a later remove-to-zero + re-add still counts as a first add.
  useEffect(() => {
    for (const id of inFlight.current) {
      if (items[id]) inFlight.current.delete(id);
    }
  }, [items]);

  useEffect(() => () => clearTimeout(catchTimer.current), []);

  const addToCart = useCallback(
    (item: MenuItem, imgEl: HTMLImageElement | null) => {
      const isFirst = !items[item.id] && !inFlight.current.has(item.id);
      if (isFirst) {
        inFlight.current.add(item.id);
        const flight = flyToCart(imgEl, cartButtonRef.current, item);
        if (flight) {
          // Hold the count until the dish lands, so the badge reads as catching it.
          setHeldCount(count);
          void flight.then(() => {
            setHeldCount(null);
            setCatching(true);
            // A second dish landing mid-animation must restart the dip, not let
            // the earlier timer cut it short (and never fire after unmount).
            clearTimeout(catchTimer.current);
            catchTimer.current = setTimeout(() => setCatching(false), 460);
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
