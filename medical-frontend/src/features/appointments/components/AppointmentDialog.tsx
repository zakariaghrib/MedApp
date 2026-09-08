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
  const [dateTime, setDateTime] = useState<string>(
    defaultDate 
      ? new Date(defaultDate.getTime() - defaultDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      : new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  );
  const [reason, setReason] = useState<string>("");

  const { data: patientsData } = useQuery({
    queryKey: ['patients', 'search', debouncedSearch],
    queryFn: () => patientService.getAll({ search: debouncedSearch, limit: 5 }),
    enabled: debouncedSearch.length > 0
  });

  const patients = patientsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => appointmentService.create(data),
    onSuccess: () => {
      toast.success("Rendez-vous créé avec succès");
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error("Veuillez sélectionner un patient");
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
                <Button variant="ghost" size="sm" onClick={() => setSelectedPatientId("")} className="text-blue-600 h-6 px-2">
                  Changer
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date et Heure</Label>
            <Input 
              type="datetime-local" 
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
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
