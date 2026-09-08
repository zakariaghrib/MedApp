import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Appointment } from "../schemas/appointment.schema";
import { User, Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppointmentSheetProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onCancel: (id: string) => void;
}

export function AppointmentSheet({ appointment, open, onOpenChange, onUpdateStatus, onCancel }: AppointmentSheetProps) {
  if (!appointment) return null;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'SCHEDULED': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Confirmé</Badge>;
      case 'WAITING': return <Badge className="bg-amber-100 text-amber-800 border-amber-200">En salle d'attente</Badge>;
      case 'COMPLETED': return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Terminé</Badge>;
      case 'CANCELED': return <Badge variant="secondary" className="line-through">Annulé</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Détails du Rendez-vous</SheetTitle>
          <SheetDescription>
            Informations et gestion du rendez-vous
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Patient Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{appointment.patient.firstName} {appointment.patient.lastName}</h3>
                <p className="text-sm text-slate-500">{appointment.patient.phone || 'Aucun numéro'}</p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(appointment.dateTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-sm text-slate-500">
                  à {new Date(appointment.dateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{appointment.reason || 'Consultation générale'}</p>
                <p className="text-sm text-slate-500">Motif</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="text-sm text-slate-500">Statut:</div>
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h4 className="font-semibold text-slate-900 mb-2">Actions</h4>
            
            {appointment.status === 'SCHEDULED' && (
              <Button 
                onClick={() => onUpdateStatus(appointment.id, 'WAITING')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                Passer en "Salle d'attente"
              </Button>
            )}

            {appointment.status === 'WAITING' && (
              <Button 
                onClick={() => onUpdateStatus(appointment.id, 'COMPLETED')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Marquer comme "Terminé"
              </Button>
            )}

            {appointment.status !== 'CANCELED' && appointment.status !== 'COMPLETED' && (
              <Button 
                onClick={() => onCancel(appointment.id)}
                variant="destructive"
                className="w-full"
              >
                Annuler le rendez-vous
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
