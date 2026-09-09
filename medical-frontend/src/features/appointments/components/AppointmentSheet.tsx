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
      <SheetContent className="sm:max-w-[480px] w-full overflow-y-auto p-6 sm:p-8">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold text-slate-800">Détails du Rendez-vous</SheetTitle>
          <SheetDescription className="text-base mt-1">
            Informations et gestion du rendez-vous
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Patient Summary */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight">{appointment.patient.firstName} {appointment.patient.lastName}</h3>
                <p className="text-slate-500 mt-0.5">{appointment.patient.phone || 'Aucun numéro'}</p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                <Clock className="h-5 w-5" />
              </div>
              <div className="mt-0.5">
                <p className="font-semibold text-slate-900 text-base leading-tight">
                  {new Date(appointment.dateTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-slate-500 font-medium mt-0.5">
                  à {new Date(appointment.dateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                <Activity className="h-5 w-5" />
              </div>
              <div className="mt-0.5">
                <p className="font-semibold text-slate-900 text-base leading-tight">{appointment.reason || 'Consultation générale'}</p>
                <p className="text-slate-500 font-medium mt-0.5">Motif</p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-slate-50">
              <div className="text-slate-500 font-medium">Statut:</div>
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELED' && (
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <h4 className="font-semibold text-lg text-slate-900 mb-3">Actions</h4>
              
              {appointment.status === 'SCHEDULED' && (
                <Button 
                  onClick={() => onUpdateStatus(appointment.id, 'WAITING')}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white text-base rounded-xl transition-all"
                >
                  Passer en "Salle d'attente"
                </Button>
              )}

              {appointment.status === 'WAITING' && (
                <Button 
                  onClick={() => onUpdateStatus(appointment.id, 'COMPLETED')}
                  className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white text-base rounded-xl transition-all"
                >
                  Marquer comme "Terminé"
                </Button>
              )}

              <Button 
                onClick={() => onCancel(appointment.id)}
                variant="destructive"
                className="w-full h-12 text-base rounded-xl transition-all"
              >
                Annuler le rendez-vous
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
