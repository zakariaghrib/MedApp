import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: "Janvier", consultations: 186, nouveaux: 80 },
  { month: "Février", consultations: 305, nouveaux: 200 },
  { month: "Mars", consultations: 237, nouveaux: 120 },
  { month: "Avril", consultations: 273, nouveaux: 190 },
  { month: "Mai", consultations: 209, nouveaux: 130 },
  { month: "Juin", consultations: 214, nouveaux: 140 },
];

const chartConfig = {
  consultations: {
    label: "Consultations",
    color: "#0ea5e9", // sky-500
  },
  nouveaux: {
    label: "Nouveaux Patients",
    color: "#e2e8f0", // slate-200
  },
} satisfies ChartConfig;

export function DashboardChart() {
  return (
    <Card className="border-slate-200/60 shadow-sm shrink-0">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800">Activité du Cabinet</CardTitle>
        <CardDescription>Évolution des consultations sur les 6 derniers mois</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-xs text-slate-500"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="nouveaux" fill="var(--color-nouveaux)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="consultations" fill="var(--color-consultations)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
