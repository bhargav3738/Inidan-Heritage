import { Icon as IconifyIcon } from "@iconify/react";

interface IconProps {
  icon: string;
  width: number;
  className?: string;
}

export function Icon({ icon, width, className }: IconProps) {
  return (
    <IconifyIcon
      icon={icon}
      width={width}
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    />
  );
}
