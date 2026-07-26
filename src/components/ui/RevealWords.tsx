import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "../../lib/gsap";

interface RevealWordsProps {
  as: "h1" | "h2";
  children: string;
  className?: string;
  style?: CSSProperties;
}

export function RevealWords({
  as: Tag,
  children,
  className,
  style,
}: RevealWordsProps) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el.querySelectorAll("span"), {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Collapse the source formatting's newlines and indentation first —
  // splitting on a single space would emit an empty span per stray space.
  const words = children.trim().split(/\s+/);

  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: "inline-block",
            opacity: 0,
            transform: "translateY(0.4em)",
          }}
        >
          {word}
        </span>
      )).reduce<React.ReactNode[]>(
        (acc, node, i) => (i === 0 ? [node] : [...acc, " ", node]),
        [],
      )}
    </Tag>
  );
}
