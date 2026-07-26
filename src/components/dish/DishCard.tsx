import { useRef } from "react";
import { CartControl } from "./CartControl";
import { Icon } from "../ui/Icon";
import { money } from "../../lib/money";
import type { MenuItem } from "../../data/menu";

export function DishCard({ item }: { item: MenuItem }) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  return (
    <div
      className="rounded-3xl p-px shrink-0 snap-start"
      style={{
        background:
          "linear-gradient(135deg,rgba(198,151,63,.5),rgba(139,58,46,.1),rgba(198,151,63,.3))",
      }}
    >
      <div className="rounded-3xl bg-white overflow-hidden h-full flex flex-col">
        <div className="relative h-44">
          <img
            ref={imgRef}
            src={item.img}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          {item.signature && (
            <span
              className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-[#3A1509]"
              style={{ background: "linear-gradient(135deg,#E8C87E,#C6973F)" }}
            >
              <Icon icon="solar:fire-linear" width={12} /> Signature
            </span>
          )}
          <span
            className="absolute top-3 right-3 w-3 h-3 rounded-full"
            style={{
              background: item.veg ? "#3E8E5A" : "#8B3A2E",
              boxShadow: "0 0 0 3px rgba(0,0,0,.08)",
            }}
            aria-label={item.veg ? "Vegetarian" : "Non-vegetarian"}
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3
            className="text-lg tracking-tight text-[#3A1509]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            {item.name}
          </h3>
          <p className="mt-1.5 text-xs text-stone-500 leading-relaxed flex-1">
            {item.desc}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#8B3A2E] tabular-nums">
              {money(item.price)}
            </span>
            <CartControl item={item} imgRef={imgRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
