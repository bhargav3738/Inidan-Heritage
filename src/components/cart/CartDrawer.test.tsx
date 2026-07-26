import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CartProvider } from "../../context/CartContext";
import { UIProvider, useUI } from "../../context/UIContext";
import { AuthModal } from "../auth/AuthModal";
import { Toast } from "../ui/Toast";
import { CartDrawer } from "./CartDrawer";

function Harness() {
  const { openCart, openAuth } = useUI();
  return (
    <>
      <button onClick={openCart}>open cart</button>
      <button onClick={() => openAuth("login")}>open auth</button>
      <CartDrawer />
      <AuthModal />
      <Toast />
    </>
  );
}

function renderApp() {
  return render(
    <UIProvider>
      <CartProvider>
        <Harness />
      </CartProvider>
    </UIProvider>,
  );
}

const drawer = () => screen.getByRole("dialog", { name: "Shopping cart" });
const pressEscape = () => fireEvent.keyDown(document, { key: "Escape" });

describe("CartDrawer overlay interaction", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("Escape closes auth first, keeps the scroll lock, then closes the cart", () => {
    renderApp();

    const opener = screen.getByText("open cart");
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(screen.getByText("open auth"));
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(document.body).toHaveClass("overflow-hidden");

    pressEscape();
    // Auth closed; the cart is still open, so the lock must survive.
    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
    expect(drawer()).not.toHaveClass("translate-x-full");
    expect(document.body).toHaveClass("overflow-hidden");
    // The original's single shared lastFocusedEl was overwritten by openAuth,
    // so closing auth returned focus inside the still-open drawer.
    expect(drawer()).toContainElement(document.activeElement as HTMLElement);

    pressEscape();
    expect(drawer()).toHaveClass("translate-x-full");
    expect(document.body).not.toHaveClass("overflow-hidden");
  });

  it("keeps focus inside the drawer when Checkout fires a toast", () => {
    renderApp();

    // Focus the opener the way a real click would: it is the element a leaky
    // focus-restore would yank focus back to.
    const opener = screen.getByText("open cart");
    opener.focus();
    fireEvent.click(opener);
    const checkout = screen.getByRole("button", { name: "Checkout" });
    checkout.focus(); // a real click focuses the button first
    fireEvent.click(checkout);

    expect(screen.getByText(/Order placed!/)).toBeInTheDocument();
    expect(document.activeElement).toBe(checkout);
    expect(drawer()).toContainElement(document.activeElement as HTMLElement);

    // ...and still when the toast auto-clears 3s later.
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(document.activeElement).toBe(checkout);
    // The original never clears the message, so it stays readable for the whole
    // 300ms slide-out rather than the pill emptying as it leaves.
    expect(screen.getByText(/Order placed!/)).toBeInTheDocument();
  });
});
