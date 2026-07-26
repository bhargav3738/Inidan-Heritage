import type { CSSProperties, ReactNode } from "react";

interface GradientBorderProps {
  gradient: string;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  children: ReactNode;
}

export function GradientBorder({
  gradient,
  className = "",
  style,
  innerClassName = "",
  innerStyle,
  children,
}: GradientBorderProps) {
  return (
    <div
      className={`p-px ${className}`}
      style={{ background: gradient, ...style }}
    >
      <div className={innerClassName} style={innerStyle}>
        {children}
      </div>
    </div>
  );
}
