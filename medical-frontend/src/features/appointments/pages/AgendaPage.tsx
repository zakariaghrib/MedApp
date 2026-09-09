import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addDays, subDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { appointmentService } from "../services/appointment.service";
import { AppointmentDialog } from "../components/AppointmentDialog";
import { AppointmentSheet } from "../components/AppointmentSheet";
import { Appointment } from "../schemas/appointment.schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

export function AgendaPage() {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week">("week");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Sheet state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Computed dates for fetching
  const startDate = view === "day" ? currentDate : startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = view === "day" ? currentDate : endOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Generate days array for the grid
  const days = view === "day" 
    ? [currentDate] 
    : Array.from({ length: 6 }).map((_, i) => addDays(startDate, i)); // 6 days (Mon-Sat)

  // Hours: 08:00 to 18:00
  const hours = Array.from({ length: 11 }).map((_, i) => i + 8);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', startDate.toISOString(), endDate.toISOString()],
    queryFn: () => appointmentService.getAll(startDate.toISOString(), endDate.toISOString()),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => appointmentService.updateStatus(id, status),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['appointments'] });
      setIsSheetOpen(false);
      toast.success("Statut mis à jour");
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => appointmentService.delete(id),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['appointments'] });
      setIsSheetOpen(false);
      toast.success("Rendez-vous annulé");
    }
  });

  const updateTimeMutation = useMutation({
    mutationFn: ({ id, dateTime }: { id: string, dateTime: string }) => appointmentService.updateTime(id, dateTime),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['appointments'] });
      toast.success("Heure modifiée");
    }
  });

  const handleDragStart = (e: React.DragEvent, apt: any) => {
    e.dataTransfer.setData("appointmentId", apt.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetDay: Date) => {
    e.preventDefault();
    const aptId = e.dataTransfer.getData("appointmentId");
    if (!aptId) return;

    const column = e.currentTarget as HTMLElement;
    const rect = column.getBoundingClientRect();
    const y = Math.max(0, e.clientY - rect.top);
    
    let totalMinutesFrom8AM = (y / 160) * 60;
    totalMinutesFrom8AM = Math.round(totalMinutesFrom8AM / 15) * 15;
    
    let hour = 8 + Math.floor(totalMinutesFrom8AM / 60);
    let minutes = totalMinutesFrom8AM % 60;

    if (hour < 8) { hour = 8; minutes = 0; }
    if (hour > 18 || (hour === 18 && minutes > 0)) { hour = 18; minutes = 0; }

    const newDateTime = new Date(targetDay);
    newDateTime.setHours(hour, minutes, 0, 0);

    updateTimeMutation.mutate({ id: aptId, dateTime: newDateTime.toISOString() });
  };

  const handlePrev = () => setCurrentDate(view === "day" ? subDays(currentDate, 1) : subDays(currentDate, 7));
  const handleNext = () => setCurrentDate(view === "day" ? addDays(currentDate, 1) : addDays(currentDate, 7));
  const handleToday = () => setCurrentDate(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-50 border-blue-500 border-y-blue-200 border-r-blue-200 text-blue-900 hover:bg-blue-100';
      case 'WAITING': return 'bg-amber-50 border-amber-500 border-y-amber-200 border-r-amber-200 text-amber-900 hover:bg-amber-100';
      case 'COMPLETED': return 'bg-emerald-50 border-emerald-500 border-y-emerald-200 border-r-emerald-200 text-emerald-900 hover:bg-emerald-100';
      case 'CANCELED': return 'bg-slate-100 border-slate-400 border-y-slate-200 border-r-slate-200 text-slate-500 opacity-80 hover:bg-slate-200';
      default: return 'bg-white border-slate-500 border-y-slate-200 border-r-slate-200 text-slate-900 hover:bg-slate-50';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 bg-slate-50/50">
      
      {/* 1. L'En-tête (La barre d'outils) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        
        {/* Navigation dans le temps */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8 text-slate-600">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToday} className="h-8 font-medium text-slate-700">
            Aujourd'hui
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8 text-slate-600">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-xl font-bold text-slate-800 flex-1 text-center hidden md:block">
          {view === "day" 
            ? format(currentDate, "EEEE d MMMM yyyy", { locale: fr })
            : `${format(days[0], "d MMM", { locale: fr })} - ${format(days[5], "d MMM yyyy", { locale: fr })}`
          }
        </h2>

        {/* Sélecteur de vue & Action principale */}
        <div className="flex items-center gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week")}>
            <TabsList className="bg-slate-200/50">
              <TabsTrigger value="day">Jour</TabsTrigger>
              <TabsTrigger value="week">Semaine</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Rendez-vous
          </Button>
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-800 mb-4 md:hidden">
        {format(currentDate, "EEEE d MMMM yyyy", { locale: fr })}
      </h2>

      {/* 2. Le Calendrier Principal (La Grille) */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm">
        
        {/* En-tête des jours */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <div className="w-24 flex-none border-r border-slate-200"></div> {/* Coin vide (Heures) */}
          <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
            {days.map((day, i) => (
              <div key={i} className="py-3 text-center border-r border-slate-100 last:border-r-0">
                <p className="text-xs font-semibold uppercase text-slate-500">{format(day, "EEEE", { locale: fr })}</p>
                <p className={`text-lg font-bold ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-slate-800'}`}>
                  {format(day, "d")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grille des heures et rendez-vous */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="flex min-h-max pt-4">
            
            {/* Colonne des heures */}
            <div className="w-24 flex-none bg-slate-50/30 border-r border-slate-200 relative">
              {hours.map((hour) => (
                <div key={hour} className="h-40 relative border-b border-slate-100">
                  <span className="absolute -top-2.5 right-2 text-xs font-medium text-slate-400">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Grille des jours */}
            <div className="flex-1 grid relative" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
              
              {/* Lignes horizontales pour la grille (heures) */}
              <div className="absolute inset-0 pointer-events-none">
                {hours.map((hour) => (
                  <div key={hour} className="h-40 border-b border-slate-200 w-full flex flex-col">
                    <div className="flex-1 border-b border-dashed border-slate-100/50"></div>
                    <div className="flex-1 border-b border-dashed border-slate-200/60"></div>
                    <div className="flex-1 border-b border-dashed border-slate-100/50"></div>
                    <div className="flex-1"></div>
                  </div>
                ))}
              </div>

              {/* Colonnes verticales (jours) */}
              {days.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className="relative border-r border-slate-100/50 last:border-r-0 h-full min-h-[1760px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  
                  {/* Cartes de Rendez-vous */}
                  {!isLoading && appointments
                    .filter((apt: any) => isSameDay(new Date(apt.dateTime), day))
                    .map((apt: any) => {
                      const date = new Date(apt.dateTime);
                      const hour = date.getHours();
                      const minutes = date.getMinutes();
                      
                      // Calcul de la position (basé sur 08:00 = top 0, chaque heure = 160px)
                      const top = (hour - 8) * 160 + (minutes / 60) * 160;
                      // Hauteur fixe (ex: 30 minutes = 80px)
                      const height = 80; 

                      // Si l'heure est en dehors de la plage (08-18), ne pas afficher
                      if (hour < 8 || hour >= 19) return null;

                      return (
                        <div
                          key={apt.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, apt)}
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setIsSheetOpen(true);
                          }}
                          className={`absolute left-1 right-1 rounded-md p-2 flex flex-col cursor-pointer overflow-hidden border border-l-4 shadow-sm hover:shadow-md transition-all z-10 hover:z-20 hover:-translate-y-0.5 ${getStatusColor(apt.status)}`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <p className="font-semibold text-xs sm:text-sm leading-tight truncate">
                            {apt.patient.firstName} {apt.patient.lastName}
                          </p>
                          <p className="text-[10px] sm:text-xs opacity-90 leading-tight truncate mt-0.5 font-medium flex items-center gap-1">
                            <span>{format(date, "HH:mm")}</span>
                            <span>•</span>
                            <span className="truncate">{apt.reason || 'Consultation'}</span>
                          </p>
                        </div>
                      );
                    })
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Les Modales */}
      <AppointmentDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        defaultDate={currentDate} 
      />
      
      <AppointmentSheet 
        appointment={selectedAppointment}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
        onCancel={(id) => cancelMutation.mutate(id)}
      />

    </div>
  );
}
