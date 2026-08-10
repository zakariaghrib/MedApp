import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  className,
  iconClassName
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-200 border-slate-200/60", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h2>
              {trendValue && (
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  trend === "up" ? "bg-emerald-100 text-emerald-700" : trend === "down" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                )}>
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {trendValue}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600", iconClassName)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
