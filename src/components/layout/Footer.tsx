import type { FormEvent } from "react";
import { useUI } from "../../context/UIContext";
import { Icon } from "../ui/Icon";

const SOCIALS = [
  { label: "Instagram", icon: "solar:camera-linear" },
  { label: "Facebook", icon: "solar:users-group-rounded-linear" },
  { label: "Twitter", icon: "solar:chat-round-line-linear" },
];

const QUICK_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#specials", label: "Chef's Specials" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const { showToast } = useUI();

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast("You're on the list. Welcome!");
  };

  return (
    <footer
      className="text-stone-400"
      style={{
        background: "#231008",
        borderTop: "1px solid transparent",
        borderImage:
          "linear-gradient(90deg, rgba(198, 151, 63, 0.05), rgba(198, 151, 63, 0.5), rgba(198, 151, 63, 0.05)) 1",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#FAF6EF]"
              style={{ background: "linear-gradient(135deg, #8b3a2e, #5e2318)" }}
            >
              <Icon icon="solar:fire-linear" width={18} />
            </span>
            <span
              className="brand-lockup text-lg tracking-tight text-[#FAF6EF]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Bombay Heritage
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Slow-cooked heritage recipes, hand-ground spices, and the warmth of
            an Indian family table — since 1987.
          </p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:text-[#E8C87E] transition-colors"
                style={{ border: "1px solid rgba(250, 246, 239, 0.15)" }}
              >
                <Icon icon={social.icon} width={17} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#FAF6EF]">Quick links</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-[#E8C87E] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#FAF6EF]">
            Get seasonal specials
          </p>
          <form className="mt-4 flex gap-2" onSubmit={handleSubscribe}>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div
              className="w-full rounded-full p-px"
              style={{
                background:
                  "linear-gradient(135deg, rgba(198, 151, 63, 0.6), rgba(250, 246, 239, 0.1), rgba(198, 151, 63, 0.35))",
              }}
            >
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-full px-4 py-2.5 text-sm text-[#FAF6EF] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#C6973F]/50"
                style={{ background: "#231008" }}
              />
            </div>
            <button
              type="submit"
              aria-label="Subscribe"
              className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-[#3A1509] transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #e8c87e, #c6973f)" }}
            >
              <Icon icon="solar:arrow-right-linear" width={18} />
            </button>
          </form>
        </div>
      </div>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs flex flex-col sm:flex-row justify-between gap-2"
        style={{ borderTop: "1px solid rgba(250, 246, 239, 0.1)" }}
      >
        <span>© 2025 Bombay Heritage. All rights reserved.</span>
        <span>Crafted with cardamom &amp; care.</span>
      </div>
    </footer>
  );
}
