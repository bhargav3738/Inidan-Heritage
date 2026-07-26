import { SPECIALS } from "../../data/menu";
import { DishCard } from "../dish/DishCard";
import { useReveal } from "../../hooks/useReveal";
import { RevealWords } from "../ui/RevealWords";

export function Specials() {
  const eyebrowRef = useReveal<HTMLParagraphElement>();
  const leadRef = useReveal<HTMLParagraphElement>();
  const rowRef = useReveal<HTMLDivElement>();

  return (
    <section id="specials" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p
            ref={eyebrowRef}
            className="text-xs font-semibold uppercase tracking-widest text-saffron"
          >
            From the tandoor
          </p>
          <RevealWords
            as="h2"
            className="text-balance mt-3 text-3xl sm:text-4xl lg:text-5xl tracking-tight text-cacao font-display font-medium"
          >
            Chef&apos;s Specials
          </RevealWords>
          <p ref={leadRef} className="mt-4 text-stone-500 leading-relaxed">
            Four dishes our head chef refuses to take off the menu — perfected
            over three generations.
          </p>
        </div>
        <div
          ref={rowRef}
          className="mt-12 grid grid-flow-col auto-cols-[85%] sm:auto-cols-[48%] lg:auto-cols-fr gap-5 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {SPECIALS.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
