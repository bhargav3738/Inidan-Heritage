import type { MenuItem } from "../data/menu";

export type CartItems = Record<string, number>;

export function addItem(state: CartItems, id: string): CartItems {
  return { ...state, [id]: (state[id] ?? 0) + 1 };
}

export function changeQty(
  state: CartItems,
  id: string,
  delta: number,
): CartItems {
  if (!state[id]) return state;
  const next = { ...state, [id]: state[id] + delta };
  if (next[id] <= 0) delete next[id];
  return next;
}

export function cartCount(state: CartItems): number {
  return Object.values(state).reduce((sum, qty) => sum + qty, 0);
}

export function cartSubtotal(state: CartItems, items: MenuItem[]): number {
  return Object.entries(state).reduce((sum, [id, qty]) => {
    const item = items.find((i) => i.id === id);
    return item ? sum + item.price * qty : sum;
  }, 0);
}
