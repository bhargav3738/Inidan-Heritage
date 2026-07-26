import { useReveal } from "../../hooks/useReveal";
import { RevealWords } from "../ui/RevealWords";
import { Icon } from "../ui/Icon";

const CARD_GRADIENT =
  "linear-gradient(135deg, rgba(198, 151, 63, 0.5), rgba(139, 58, 46, 0.12), rgba(198, 151, 63, 0.35))";

const ICON_TILE =
  "w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-[#8B3A2E]";

export function Contact() {
  const eyebrowRef = useReveal<HTMLParagraphElement>();
  const infoRef = useReveal<HTMLDivElement>();
  const mapRef = useReveal<HTMLDivElement>();

  return (
    <section
      id="contact"
      className="py-20 sm:py-28"
      style={{ background: "linear-gradient(180deg, #f4ede1, #faf6ef)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p
            ref={eyebrowRef}
            className="text-xs font-semibold uppercase tracking-widest text-[#C6973F]"
          >
            Visit us
          </p>
          <RevealWords
            as="h2"
            className="text-balance mt-3 text-3xl sm:text-4xl tracking-tight text-[#3A1509]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Find Your Table
          </RevealWords>
        </div>
        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          <div
            ref={infoRef}
            className="rounded-3xl p-px"
            style={{ background: CARD_GRADIENT }}
          >
            <div className="rounded-3xl bg-white p-7 sm:p-9 h-full">
              <ul className="space-y-6 text-sm">
                <li className="flex gap-4">
                  <span
                    className={ICON_TILE}
                    style={{ background: "rgba(139, 58, 46, 0.08)" }}
                  >
                    <Icon icon="solar:map-point-linear" width={20} />
                  </span>
                  <span>
                    <strong className="block font-semibold text-stone-800">
                      Address
                    </strong>
                    <span className="text-stone-500">
                      42 Spice Lane, Old Town District, ST 10021
                    </span>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span
                    className={ICON_TILE}
                    style={{ background: "rgba(139, 58, 46, 0.08)" }}
                  >
                    <Icon icon="solar:phone-linear" width={20} />
                  </span>
                  <span>
                    <strong className="block font-semibold text-stone-800">
                      Phone
                    </strong>
                    <a
                      href="tel:+15551234567"
                      className="text-stone-500 hover:text-[#8B3A2E] transition-colors"
                    >
                      (555) 123-4567
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span
                    className={ICON_TILE}
                    style={{ background: "rgba(139, 58, 46, 0.08)" }}
                  >
                    <Icon icon="solar:letter-linear" width={20} />
                  </span>
                  <span>
                    <strong className="block font-semibold text-stone-800">
                      Email
                    </strong>
                    <a
                      href="mailto:hello@bombayheritage.com"
                      className="text-stone-500 hover:text-[#8B3A2E] transition-colors"
                    >
                      hello@bombayheritage.com
                    </a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span
                    className={ICON_TILE}
                    style={{ background: "rgba(139, 58, 46, 0.08)" }}
                  >
                    <Icon icon="solar:clock-circle-linear" width={20} />
                  </span>
                  <span>
                    <strong className="block font-semibold text-stone-800">
                      Hours
                    </strong>
                    <span className="text-stone-500">
                      Mon–Sun · 11:30 AM – 10:30 PM
                      <br />
                      Kitchen closes at 10:00 PM
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div
            ref={mapRef}
            className="rounded-3xl p-px"
            style={{ background: CARD_GRADIENT }}
          >
            <iframe
              title="Map to Bombay Heritage restaurant"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.7!2d72.8258!3d18.9220!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU1JzE5LjIiTiA3MsKwNDknMzIuOSJF!5e0!3m2!1sen!2sus!4v1700000000000"
              className="rounded-3xl w-full h-full min-h-[360px]"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
