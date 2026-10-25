import { cn } from "@/lib/utils";
import React from "react";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
  fade?: boolean;
}

const Marquee = ({ 
  children, 
  className, 
  pauseOnHover = false,
  reverse = false,
  fade = false,
  ...props 
}: MarqueeProps) => {
  return (
    <div
      className={cn(
        "group/marquee relative flex w-full overflow-hidden [gap:var(--gap,1rem)]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-max shrink-0 items-center justify-around [gap:var(--gap,1rem)] animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {children}
      </div>
      
      <div
        className={cn(
          "flex w-max shrink-0 items-center justify-around [gap:var(--gap,1rem)] animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]"
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
};

export { Marquee };