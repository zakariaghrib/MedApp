import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus, CalendarPlus, FileText, FileCheck2 } from "lucide-react";

export function QuickActions() {
  const actions = [
    { icon: UserPlus, label: "Nouveau Patient", color: "text-sky-600", bg: "bg-sky-50", hover: "hover:border-sky-200 hover:bg-sky-50/50" },
    { icon: CalendarPlus, label: "Planifier RDV", color: "text-indigo-600", bg: "bg-indigo-50", hover: "hover:border-indigo-200 hover:bg-indigo-50/50" },
    { icon: FileText, label: "Ordonnance", color: "text-emerald-600", bg: "bg-emerald-50", hover: "hover:border-emerald-200 hover:bg-emerald-50/50" },
    { icon: FileCheck2, label: "Facturation", color: "text-amber-600", bg: "bg-amber-50", hover: "hover:border-amber-200 hover:bg-amber-50/50" },
  ];

  return (
    <Card className="border-slate-200/60 shadow-sm shrink-0">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800">Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${action.hover}`}
            >
              <div className={`p-3 rounded-full ${action.bg} ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-slate-700">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
