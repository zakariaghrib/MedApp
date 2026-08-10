import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const appointments = [
  { id: 1, time: "09:00", patient: "Alice Dupont", reason: "Consultation générale", status: "En salle d'attente" },
  { id: 2, time: "09:30", patient: "Marc Tremblay", reason: "Suivi traitement", status: "Confirmé" },
  { id: 3, time: "10:15", patient: "Sophie Martin", reason: "Renouvellement ordonnance", status: "Confirmé" },
  { id: 4, time: "11:00", patient: "Jean Lavoie", reason: "Douleurs articulaires", status: "Confirmé" },
  { id: 5, time: "11:30", patient: "Marie Dubois", reason: "Vaccin", status: "Annulé" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "En salle d'attente":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
    case "Confirmé":
      return "bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-200";
    case "Terminé":
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200";
    case "Annulé":
      return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
  }
};

export function TodayAgenda() {
  return (
    <Card className="flex flex-col h-full border-slate-200/60 shadow-sm">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
          <span>Agenda du jour</span>
          <Badge variant="outline" className="text-sky-700 border-sky-200 bg-sky-50 px-2 py-0.5 rounded-full shadow-sm">Aujourd'hui</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col min-h-[350px]">
        <ScrollArea className="flex-1 p-6">
          <div className="relative border-l-2 border-slate-200/60 ml-3 space-y-8 pb-4">
            {appointments.map((apt, index) => (
              <div key={apt.id} className="relative pl-6 group">
                {/* Timeline dot */}
                <div className={cn(
                  "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-[3px] border-white shadow-sm ring-1 ring-slate-200/50 transition-transform group-hover:scale-110",
                  index === 0 ? "bg-amber-400" : "bg-sky-400"
                )} />
                
                <div className="flex flex-col gap-1.5 p-3 -mt-2 rounded-xl border border-transparent group-hover:bg-slate-50 group-hover:border-slate-100 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">{apt.patient}</span>
                    <div className="flex items-center text-xs font-semibold text-slate-600 bg-white border border-slate-200 shadow-sm px-2 py-1 rounded-md">
                      <Clock className="mr-1.5 h-3 w-3 text-slate-400" />
                      {apt.time}
                    </div>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">{apt.reason}</span>
                  <div className="mt-1.5">
                    <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5 shadow-sm", getStatusColor(apt.status))}>
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
