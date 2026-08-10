import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileEdit, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  { id: 1, type: "edit", message: "Dossier mis à jour : Sophie Martin", time: "Il y a 10 min", icon: FileEdit, color: "text-sky-600", bg: "bg-sky-100" },
  { id: 2, type: "success", message: "Nouveau patient enregistré : Paul Blanc", time: "Il y a 45 min", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  { id: 3, type: "alert", message: "Résultats d'analyse reçus : Marc Tremblay", time: "Il y a 2h", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" },
  { id: 4, type: "edit", message: "Ordonnance créée : Alice Dupont", time: "Il y a 3h", icon: FileEdit, color: "text-sky-600", bg: "bg-sky-100" },
];

export function RecentActivity() {
  return (
    <Card className="flex flex-col h-full border-slate-200/60 shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800">Dernières Activités</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[350px] p-5">
          <div className="space-y-4 pr-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 rounded-xl p-3 border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-all cursor-default">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm", activity.bg, activity.color)}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-slate-900 leading-snug">{activity.message}</p>
                  <span className="text-xs text-slate-500 font-medium">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
