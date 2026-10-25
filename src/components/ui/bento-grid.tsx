import { ComponentPropsWithoutRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href?: string
  cta?: string
  onCTAClick?: () => void
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  onCTAClick,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    onClick={onCTAClick}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl border border-white/10",
      "bg-neutral-950/90 hover:bg-neutral-900/90 shadow-xl",
      "transition-all duration-300 hover:border-primary/40 hover:shadow-primary/10",
      onCTAClick && "cursor-pointer",
      className
    )}
    {...props}
  >
    <div>{background}</div>
    <div className="p-6 relative z-10">
      <div className="z-10 flex flex-col gap-1.5 transition-all duration-300">
        <Icon className="h-10 w-10 origin-left text-primary transition-all duration-300 ease-in-out group-hover:scale-95" />
        <h3 className="text-xl font-bold text-white tracking-tight">
          {name}
        </h3>
        <p className="max-w-lg text-sm text-neutral-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300" />
  </div>
)

export { BentoCard, BentoGrid }
