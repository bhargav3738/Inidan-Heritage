import { useEffect, useState } from "react";
import { useUI } from "../../context/UIContext";
import { useCart } from "../../context/CartContext";
import { Icon } from "../ui/Icon";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#menu", label: "Menu" },
  { href: "#specials", label: "Chef's Specials" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const BRAND_GRADIENT = "linear-gradient(135deg, #8b3a2e, #5e2318)";

export function Navbar() {
  const { openCart, openAuth, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useUI();
  const { displayCount, catching, cartButtonRef } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backdropFilter: "blur(12px)",
        background: "rgba(250, 246, 239, 0.85)",
        borderBottom: "1px solid rgba(139, 58, 46, 0.08)",
        boxShadow: scrolled ? "0 1px 0 rgba(139,58,46,.1)" : "none",
      }}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <a href="#home" className="flex items-center gap-2.5">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-surface"
            style={{ background: BRAND_GRADIENT }}
          >
            <Icon icon="solar:fire-linear" width={18} />
          </span>
          <span
            className="brand-lockup text-lg tracking-tight text-heritage-deep font-display font-semibold"
          >
            Bombay Heritage
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-heritage transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            ref={cartButtonRef}
            aria-label={
              displayCount === 0
                ? "Open cart"
                : `Open cart, ${displayCount} item${displayCount === 1 ? "" : "s"}`
            }
            onClick={openCart}
            className={`cart-btn relative w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-heritage/10 transition-colors focus:outline-none focus:ring-2 focus:ring-heritage/40 ${
              catching ? "is-catching" : ""
            }`}
          >
            <Icon icon="solar:cart-large-2-linear" width={22} />
            {displayCount > 0 && (
              <span
                key={displayCount}
                className="cart-badge is-pop absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-heritage text-white text-xs font-semibold flex items-center justify-center"
              >
                {displayCount}
              </span>
            )}
          </button>
          <button
            onClick={() => openAuth("login")}
            className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-surface transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-heritage/40"
            style={{ background: BRAND_GRADIENT }}
          >
            Login / Sign Up
          </button>
          <button
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={toggleMobileMenu}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-heritage/10 transition-colors"
          >
            <Icon icon="solar:hamburger-menu-linear" width={22} />
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1 text-sm font-medium text-stone-700"
          style={{ borderTop: "1px solid rgba(139, 58, 46, 0.08)" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className="block px-3 py-2.5 rounded-lg hover:bg-heritage/10"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => openAuth("login")}
            className="mt-2 w-full rounded-full px-4 py-2.5 text-sm font-medium text-surface"
            style={{ background: BRAND_GRADIENT }}
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </header>
  );
}
