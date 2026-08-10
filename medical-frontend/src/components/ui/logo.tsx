import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({ className, iconClassName, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 100 100"
        className={cn("h-10 w-10 text-sky-500", iconClassName)}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {/* Top half of cross */}
        <path d="M 15 42 L 15 30 L 35 30 L 35 10 L 65 10 L 65 30 L 85 30 L 85 42" strokeWidth="8" />
        
        {/* Bottom half of cross */}
        <path d="M 15 58 L 15 70 L 35 70 L 35 90 L 65 90 L 65 70 L 85 70 L 85 58" strokeWidth="8" />
        
        {/* Heartbeat line */}
        <path d="M 15 50 L 28 50 L 35 32 L 45 75 L 55 20 L 65 50 L 85 50" strokeWidth="6" />
      </svg>
      <span className={cn("text-2xl font-bold tracking-tight text-blue-900", textClassName)}>
        MedApp
      </span>
    </div>
  );
}
