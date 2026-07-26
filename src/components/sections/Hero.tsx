import { useReveal } from "../../hooks/useReveal";
import { RevealWords } from "../ui/RevealWords";
import { GradientBorder } from "../ui/GradientBorder";
import { Icon } from "../ui/Icon";

export function Hero() {
  const badgeRef = useReveal<HTMLSpanElement>();
  const leadRef = useReveal<HTMLParagraphElement>();
  const ctaRef = useReveal<HTMLDivElement>();
  const stripRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-end sm:items-center pt-16"
    >
      <img
        src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000&auto=format&fit=crop"
        alt="Signature butter chicken curry served in a copper bowl with fresh herbs"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(24, 10, 6, 0.88) 0%, rgba(24, 10, 6, 0.65) 45%, rgba(24, 10, 6, 0.25) 100%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16 sm:pb-0">
        <div className="max-w-2xl">
          <span
            ref={badgeRef}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#E8C87E] mb-6"
            style={{
              border: "1px solid rgba(198, 151, 63, 0.4)",
              background: "rgba(198, 151, 63, 0.1)",
            }}
          >
            <Icon icon="solar:star-linear" width={14} />
            Est. 1987 · A family recipe legacy
          </span>
          <RevealWords
            as="h1"
            className="hero-title tracking-tight text-[#FAF6EF] leading-[1.05]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Bombay Heritage
          </RevealWords>
          <p
            ref={leadRef}
            className="mt-5 text-base sm:text-lg text-stone-300 max-w-lg leading-relaxed"
          >
            Authentic Indian flavours, served the way they were meant to be —
            slow-cooked, hand-spiced, and shared around the table.
          </p>
          <div ref={ctaRef} className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#menu"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-[#3A1509] transition-transform hover:scale-[1.03]"
              style={{ background: "linear-gradient(135deg, #e8c87e, #c6973f)" }}
            >
              Order Now
              <Icon icon="solar:arrow-right-linear" width={17} />
            </a>
            <a
              href="#specials"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-[#FAF6EF] transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(250, 246, 239, 0.3)" }}
            >
              View Chef&apos;s Specials
            </a>
          </div>
          <div ref={stripRef} className="mt-12">
          <GradientBorder
            gradient="linear-gradient(135deg, rgba(198, 151, 63, 0.5), rgba(250, 246, 239, 0.08), rgba(198, 151, 63, 0.35))"
            className="rounded-2xl"
            innerClassName="rounded-2xl px-5 py-4 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-stone-300"
            innerStyle={{
              background: "rgba(24, 10, 6, 0.7)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="flex items-center gap-2">
              <Icon
                icon="solar:clock-circle-linear"
                width={17}
                className="text-[#E8C87E]"
              />
              Open daily · 11:30 AM – 10:30 PM
            </span>
            <span className="flex items-center gap-2">
              <Icon
                icon="solar:map-point-linear"
                width={17}
                className="text-[#E8C87E]"
              />
              42 Spice Lane, Old Town
            </span>
            <a
              href="tel:+15551234567"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Icon
                icon="solar:phone-linear"
                width={17}
                className="text-[#E8C87E]"
              />
              (555) 123-4567
            </a>
          </GradientBorder>
          </div>
        </div>
      </div>
    </section>
  );
}
