"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  pauseOnHover?: boolean;
  reverse?: boolean;
  vertical?: boolean;
}

export function Marquee({
  children,
  className,
  pauseOnHover = false,
  reverse = false,
  vertical = false,
  ...props
}: MarqueeProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={cn("flex overflow-hidden", className)}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 gap-[--gap] animate-[marquee_var(--duration)_linear_infinite]",
          vertical &&
            "flex-col animate-[marquee-vertical_var(--duration)_linear_infinite]",
          reverse && "flex-row-reverse",
          isHovered && "animation-play-state-paused"
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "flex shrink-0 gap-[--gap] animate-[marquee_var(--duration)_linear_infinite]",
          vertical &&
            "flex-col animate-[marquee-vertical_var(--duration)_linear_infinite]",
          reverse && "flex-row-reverse",
          isHovered && "animation-play-state-paused"
        )}
      >
        {children}
      </div>
    </div>
  );
}
