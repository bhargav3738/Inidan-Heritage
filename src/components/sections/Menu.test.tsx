import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UIProvider } from "../../context/UIContext";
import { CartProvider } from "../../context/CartContext";
import { Menu } from "./Menu";

function renderMenu() {
  return render(
    <UIProvider>
      <CartProvider>
        <Menu />
      </CartProvider>
    </UIProvider>,
  );
}

describe("Menu", () => {
  it("shows all ten dishes under the All tab by default", () => {
    renderMenu();
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("10 dishes")).toBeInTheDocument();
  });

  it("filters to a category and updates the count note", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("tab", { name: "Starters" }));

    expect(screen.getByRole("tab", { name: "Starters" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("2 dishes")).toBeInTheDocument();
    expect(screen.getByText("Vegetable Samosa")).toBeInTheDocument();
    expect(screen.queryByText("Butter Chicken")).not.toBeInTheDocument();
  });

  it("reports the right count for every category", async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole("tab", { name: "Mains" }));
    expect(screen.getByText("4 dishes")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Breads & Rice" }));
    expect(screen.getByText("2 dishes")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Desserts" }));
    expect(screen.getByText("2 dishes")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "All" }));
    expect(screen.getByText("10 dishes")).toBeInTheDocument();
  });
});
