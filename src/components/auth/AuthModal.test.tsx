import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UIProvider, useUI } from "../../context/UIContext";
import { AuthModal } from "./AuthModal";

function Harness() {
  const { openAuth } = useUI();
  return (
    <>
      <button onClick={() => openAuth("login")}>open</button>
      <AuthModal />
    </>
  );
}

function renderAuth() {
  return render(
    <UIProvider>
      <Harness />
    </UIProvider>,
  );
}

describe("AuthModal", () => {
  it("is not rendered until opened", () => {
    renderAuth();
    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
  });

  it("opens in login mode with the name field hidden", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByText("open"));

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign In" }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
  });

  it("switches to signup mode and reveals the name field", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByText("open"));
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(
      screen.getByText("Join us for faster checkout and seasonal specials."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("closes on the back button", async () => {
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByText("open"));
    await user.click(screen.getByRole("button", { name: /Back to site/i }));

    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
  });
});
