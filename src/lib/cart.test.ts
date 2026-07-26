import { describe, expect, it } from "vitest";
import { addItem, cartCount, cartSubtotal, changeQty } from "./cart";
import { MENU_ITEMS } from "../data/menu";

describe("addItem", () => {
  it("creates a line at quantity 1 for a new dish", () => {
    expect(addItem({}, "samosa")).toEqual({ samosa: 1 });
  });

  it("increments an existing dish", () => {
    expect(addItem({ samosa: 2 }, "samosa")).toEqual({ samosa: 3 });
  });

  it("leaves other lines untouched", () => {
    expect(addItem({ kulfi: 1 }, "samosa")).toEqual({ kulfi: 1, samosa: 1 });
  });

  it("does not mutate the input", () => {
    const state = { samosa: 1 };
    addItem(state, "samosa");
    expect(state).toEqual({ samosa: 1 });
  });
});

describe("changeQty", () => {
  it("increments by a positive delta", () => {
    expect(changeQty({ samosa: 1 }, "samosa", 1)).toEqual({ samosa: 2 });
  });

  it("decrements by a negative delta", () => {
    expect(changeQty({ samosa: 3 }, "samosa", -1)).toEqual({ samosa: 2 });
  });

  it("removes the line entirely when it reaches zero", () => {
    expect(changeQty({ samosa: 1 }, "samosa", -1)).toEqual({});
  });

  it("removes the line when it would go below zero", () => {
    expect(changeQty({ samosa: 1 }, "samosa", -5)).toEqual({});
  });

  it("ignores a dish that is not in the cart", () => {
    expect(changeQty({ kulfi: 1 }, "samosa", 1)).toEqual({ kulfi: 1 });
  });

  it("does not mutate the input", () => {
    const state = { samosa: 2 };
    changeQty(state, "samosa", -1);
    expect(state).toEqual({ samosa: 2 });
  });
});

describe("cartCount", () => {
  it("is zero for an empty cart", () => {
    expect(cartCount({})).toBe(0);
  });

  it("sums quantities across lines", () => {
    expect(cartCount({ samosa: 2, kulfi: 3 })).toBe(5);
  });
});

describe("cartSubtotal", () => {
  it("is zero for an empty cart", () => {
    expect(cartSubtotal({}, MENU_ITEMS)).toBe(0);
  });

  it("multiplies price by quantity for a single line", () => {
    // samosa 6.50 x 2
    expect(cartSubtotal({ samosa: 2 }, MENU_ITEMS)).toBeCloseTo(13.0, 2);
  });

  it("sums mixed quantities and prices", () => {
    // samosa 6.50 x 2 = 13.00, butter-chicken 17.50 x 1 = 17.50
    expect(cartSubtotal({ samosa: 2, "butter-chicken": 1 }, MENU_ITEMS))
      .toBeCloseTo(30.5, 2);
  });

  it("skips ids that are not on the menu", () => {
    expect(cartSubtotal({ "not-a-dish": 4 }, MENU_ITEMS)).toBe(0);
  });
});
