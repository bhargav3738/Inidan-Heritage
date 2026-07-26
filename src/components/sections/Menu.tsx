import { useState } from "react";
import { MENU_CATEGORIES, MENU_ITEMS, type CategoryId } from "../../data/menu";
import { DishCard } from "../dish/DishCard";
import { useReveal } from "../../hooks/useReveal";
import { RevealWords } from "../ui/RevealWords";
import { Icon } from "../ui/Icon";

type TabId = CategoryId | "all";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All" },
  ...MENU_CATEGORIES,
];

export function Menu() {
  const [activeCategory, setActiveCategory] = useState<TabId>("all");
  const eyebrowRef = useReveal<HTMLParagraphElement>();
  const leadRef = useReveal<HTMLParagraphElement>();
  const legendRef = useReveal<HTMLDivElement>();
  const tabsRef = useReveal<HTMLDivElement>();

  const items =
    activeCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <section
      id="menu"
      className="py-20 sm:py-28"
      style={{ background: "linear-gradient(180deg, #f4ede1, #faf6ef)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p
            ref={eyebrowRef}
            className="text-xs font-semibold uppercase tracking-widest text-saffron"
          >
            The full spread
          </p>
          <RevealWords
            as="h2"
            className="text-balance mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-tight text-cacao font-display font-medium"
          >
            Explore Our Menu
          </RevealWords>
          <p ref={leadRef} className="mt-4 text-stone-500 leading-relaxed">
            Every dish is prepared fresh, with spices ground in-house each
            morning. Pick a category to browse.
          </p>
          <div
            ref={legendRef}
            className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-stone-500"
          >
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: "#3e8e5a",
                  boxShadow: "0 0 0 3px rgba(62, 142, 90, 0.15)",
                }}
              />
              Vegetarian
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: "#8b3a2e",
                  boxShadow: "0 0 0 3px rgba(139, 58, 46, 0.15)",
                }}
              />
              Non-Vegetarian
            </span>
            <span className="flex items-center gap-1.5">
              <Icon
                icon="solar:fire-linear"
                width={13}
                className="text-saffron"
              />
              Heritage signature
            </span>
          </div>
        </div>
        <div
          ref={tabsRef}
          className="mt-10 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Menu categories"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeCategory === tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={
                activeCategory === tab.id
                  ? { background: "#8B3A2E", color: "#FAF6EF" }
                  : { background: "rgba(139,58,46,.06)", color: "#57534E" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="mt-8 text-center text-xs font-medium uppercase tracking-widest text-stone-400">
          {items.length} dish{items.length === 1 ? "" : "es"}
        </p>
        <div
          className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          aria-live="polite"
        >
          {items.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
