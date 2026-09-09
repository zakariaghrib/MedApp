import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patientService } from "@/features/patients/services/patient.service";
import { appointmentService } from "../services/appointment.service";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
}

export function AppointmentDialog({ open, onOpenChange, defaultDate }: AppointmentDialogProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const getDefaultDateTime = () => {
    const d = defaultDate ? new Date(defaultDate) : new Date();
    d.setHours(9, 0, 0, 0); // Force 09:00 par défaut
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [dateTime, setDateTime] = useState<string>(getDefaultDateTime());
  const [reason, setReason] = useState<string>("");

  const { data: patientsData } = useQuery({
    queryKey: ['patients', 'search', debouncedSearch],
    queryFn: () => patientService.getAll({ search: debouncedSearch, limit: 5 }),
    enabled: debouncedSearch.length > 0
  });

  const patients = patientsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => appointmentService.create(data),
    onSuccess: async () => {
      toast.success("Rendez-vous créé avec succès");
      await queryClient.refetchQueries({ queryKey: ['appointments'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création du rendez-vous");
    }
  });

  const resetForm = () => {
    setSearchTerm("");
    setSelectedPatientId("");
    setReason("");
  };

  const datePart = dateTime.slice(0, 10);
  const timePart = dateTime.slice(11, 16);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(`${e.target.value}T${timePart}`);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(`${datePart}T${e.target.value}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error("Veuillez sélectionner un patient");
      return;
    }

    const hour = parseInt(timePart.split(':')[0], 10);
    const minute = parseInt(timePart.split(':')[1], 10);
    
    if (hour < 8 || hour > 18 || (hour === 18 && minute > 0)) {
      toast.error("Veuillez choisir une heure entre 08:00 et 18:00");
      return;
    }
    
    createMutation.mutate({
      patientId: selectedPatientId,
      dateTime: new Date(dateTime).toISOString(),
      reason: reason || "Consultation générale"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau Rendez-vous</DialogTitle>
          <DialogDescription>
            Planifier une consultation pour un patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {/* Recherche patient */}
          <div className="space-y-2">
            <Label>Patient</Label>
            {!selectedPatientId ? (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Rechercher par nom ou CIN..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {patients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {patients.map((p: any) => (
                      <div 
                        key={p.id}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setSearchTerm(`${p.firstName} ${p.lastName} (${p.cin})`);
                        }}
                      >
                        <p className="text-sm font-medium text-slate-900">{p.firstName} {p.lastName}</p>
                        <p className="text-xs text-slate-500">CIN: {p.cin} • Tel: {p.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-md">
                <span className="text-sm font-medium text-blue-900">{searchTerm}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPatientId("")} className="text-blue-600 h-6 px-2">
                  Changer
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Date</Label>
              <Input 
                type="date" 
                value={datePart}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Heure (08:00 - 18:00)</Label>
              <Input 
                type="time" 
                value={timePart}
                onChange={handleTimeChange}
                min="08:00"
                max="18:00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Motif de consultation</Label>
            <Select value={reason} onValueChange={(val) => setReason(val as string)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un motif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consultation générale">Consultation générale</SelectItem>
                <SelectItem value="Suivi">Suivi</SelectItem>
                <SelectItem value="Contrôle de routine">Contrôle de routine</SelectItem>
                <SelectItem value="Urgence">Urgence</SelectItem>
                <SelectItem value="Renouvellement d'ordonnance">Renouvellement d'ordonnance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={createMutation.isPending || !selectedPatientId}>
              {createMutation.isPending ? "Création..." : "Confirmer le RDV"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
