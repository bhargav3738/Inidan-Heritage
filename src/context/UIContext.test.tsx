import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UIProvider, useUI } from "./UIContext";

function Probe() {
  const { toast, showToast, authMode, openAuth, toggleAuthMode } = useUI();
  return (
    <div>
      <button onClick={() => showToast("Added")}>fire</button>
      <button onClick={() => openAuth("login")}>auth</button>
      <button onClick={toggleAuthMode}>toggle</button>
      <span data-testid="toast">{toast ?? "none"}</span>
      <span data-testid="mode">{authMode ?? "closed"}</span>
    </div>
  );
}

describe("UIProvider", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows a toast and clears it after 3000ms", () => {
    render(
      <UIProvider>
        <Probe />
      </UIProvider>,
    );

    expect(screen.getByTestId("toast")).toHaveTextContent("none");
    act(() => {
      fireEvent.click(screen.getByText("fire"));
    });
    expect(screen.getByTestId("toast")).toHaveTextContent("Added");

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("toast")).toHaveTextContent("none");
  });

  it("toggles auth mode between login and signup", () => {
    render(
      <UIProvider>
        <Probe />
      </UIProvider>,
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("closed");
    act(() => {
      fireEvent.click(screen.getByText("auth"));
    });
    expect(screen.getByTestId("mode")).toHaveTextContent("login");
    act(() => {
      fireEvent.click(screen.getByText("toggle"));
    });
    expect(screen.getByTestId("mode")).toHaveTextContent("signup");
  });
});
