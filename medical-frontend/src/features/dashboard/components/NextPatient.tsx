import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, FileText } from "lucide-react";

export function NextPatient() {
  return (
    <Card className="border-sky-200 bg-gradient-to-r from-sky-50 to-white shadow-sm shrink-0">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white font-bold text-lg shadow-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold text-sky-600 mb-1">Prochain Patient (dans 10 min)</p>
              <h3 className="text-xl font-bold text-slate-900">Alice Dupont</h3>
              <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 09:00</span>
                <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> Consultation générale</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700">
              Voir dossier
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white shadow-sm">
              <PlayCircle className="mr-2 h-4 w-4" />
              Démarrer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
