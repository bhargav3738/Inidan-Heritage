import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RevealWords } from "./RevealWords";

describe("RevealWords", () => {
  it("splits text into separate word spans with whitespace preserved between them", () => {
    const { container } = render(
      <RevealWords as="h1">Bombay Heritage</RevealWords>,
    );
    const heading = container.querySelector("h1");
    expect(heading).not.toBeNull();

    const spans = heading!.querySelectorAll("span");
    expect(spans).toHaveLength(2);
    expect(spans[0].textContent).toBe("Bombay");
    expect(spans[1].textContent).toBe("Heritage");

    // This is the assertion that actually matters: it guards against the
    // words running together as "BombayHeritage" if the space-interleaving
    // `reduce` in RevealWords is ever wrong, since adjacent inline-block
    // spans have no whitespace between them on their own.
    expect(heading!.textContent).toBe("Bombay Heritage");
  });

  it("collapses newlines and indentation into a single split, matching .trim().split(/\\s+/)", () => {
    const { container } = render(
      <RevealWords as="h2">{"Chef's\n   Specials"}</RevealWords>,
    );
    const heading = container.querySelector("h2");
    expect(heading).not.toBeNull();

    const spans = heading!.querySelectorAll("span");
    expect(spans).toHaveLength(2);
    expect(spans[0].textContent).toBe("Chef's");
    expect(spans[1].textContent).toBe("Specials");
  });
});
