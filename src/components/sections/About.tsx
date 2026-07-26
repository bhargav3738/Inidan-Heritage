import { useAboutUncover } from "../../hooks/useAboutUncover";

const STAT_GRADIENT =
  "linear-gradient(135deg, rgba(198, 151, 63, 0.45), rgba(139, 58, 46, 0.1))";

const STATS = [
  { value: "37+", label: "Years serving", i: 4 },
  { value: "62", label: "Family recipes", i: 5 },
  { value: "4.9★", label: "Guest rating", i: 6 },
];

export function About() {
  const sectionRef = useAboutUncover<HTMLDivElement>();

  return (
    <section id="about" className="py-20 sm:py-28">
      <div
        ref={sectionRef}
        className="about-reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
      >
        <div
          className="about-uncover-item rounded-3xl p-px order-2 lg:order-1 overflow-hidden"
          style={{
            "--i": 0,
            background:
              "linear-gradient(135deg, rgba(198, 151, 63, 0.6), rgba(139, 58, 46, 0.15), rgba(198, 151, 63, 0.4))",
          } as React.CSSProperties}
        >
          <img
            src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1400&auto=format&fit=crop"
            alt="A traditional Indian thali with assorted curries, breads and rice"
            className="about-uncover-img rounded-3xl w-full h-[420px] object-cover"
            loading="lazy"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p
            className="about-uncover-item text-xs font-semibold uppercase tracking-widest text-saffron"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            Our story
          </p>
          <h2
            className="about-uncover-item text-balance mt-3 text-3xl sm:text-4xl tracking-tight text-cacao font-display font-medium"
            style={
              {
                "--i": 1,
              } as React.CSSProperties
            }
          >
            Three generations of one kitchen
          </h2>
          <p
            className="about-uncover-item mt-5 text-stone-500 leading-relaxed"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            In 1987, our grandmother opened a six-table eatery with nothing but
            her handwritten recipe book and a clay tandoor. Today, that same
            book still guides every dish we serve — from the eighteen-hour dal
            makhani to the saffron kulfi she churned by hand.
          </p>
          <p
            className="about-uncover-item mt-4 text-stone-500 leading-relaxed"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            We believe heritage isn&apos;t preserved in museums. It&apos;s
            preserved at the table, one shared meal at a time.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="about-uncover-item rounded-2xl p-px"
                style={
                  { "--i": stat.i, background: STAT_GRADIENT } as React.CSSProperties
                }
              >
                <div className="rounded-2xl bg-white px-2 sm:px-4 py-5 text-center">
                  <p
                    className="text-2xl tracking-tight text-heritage font-display font-semibold"
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
