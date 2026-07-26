import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UIProvider } from "../../context/UIContext";
import { CartProvider } from "../../context/CartContext";
import { DishCard } from "./DishCard";
import { MENU_ITEMS } from "../../data/menu";

const samosa = MENU_ITEMS.find((i) => i.id === "samosa")!;

function renderCard() {
  return render(
    <UIProvider>
      <CartProvider>
        <DishCard item={samosa} />
      </CartProvider>
    </UIProvider>,
  );
}

describe("CartControl", () => {
  it("starts in the Add state", () => {
    const { container } = renderCard();
    expect(container.querySelector(".cart-ctl")).not.toHaveClass("is-qty");
    expect(
      screen.getByRole("button", { name: /Add Vegetable Samosa to cart/i }),
    ).toBeInTheDocument();
  });

  it("switches to the quantity state after adding", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();

    await user.click(
      screen.getByRole("button", { name: /Add Vegetable Samosa to cart/i }),
    );

    expect(container.querySelector(".cart-ctl")).toHaveClass("is-qty");
    expect(container.querySelector(".cart-ctl-num")).toHaveTextContent("1");
  });

  it("increments and decrements through the stepper", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();

    await user.click(
      screen.getByRole("button", { name: /Add Vegetable Samosa to cart/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Add one more Vegetable Samosa/i }),
    );
    expect(container.querySelector(".cart-ctl-num")).toHaveTextContent("2");

    await user.click(
      screen.getByRole("button", { name: /Remove one Vegetable Samosa/i }),
    );
    expect(container.querySelector(".cart-ctl-num")).toHaveTextContent("1");
  });

  it("returns to the Add state when the quantity reaches zero", async () => {
    const user = userEvent.setup();
    const { container } = renderCard();

    await user.click(
      screen.getByRole("button", { name: /Add Vegetable Samosa to cart/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /Remove one Vegetable Samosa/i }),
    );

    expect(container.querySelector(".cart-ctl")).not.toHaveClass("is-qty");
  });
});
