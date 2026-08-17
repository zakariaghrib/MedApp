import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { patientSchema } from '../schemas/patient.schema';
import { patientService } from '../services/patient.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '../schemas/patient.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface PatientFormProps {
  patient?: Patient;
  onSuccess?: () => void;
}

export function PatientForm({ patient, onSuccess }: PatientFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema) as any,
    defaultValues: patient ? {
      ...patient,
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
    } : {
      cin: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'M',
      phone: '',
      email: '',
      address: '',
      mutuelle: '',
      bloodGroup: '',
      medicalHistory: '',
      chronicConditions: '',
      allergies: '',
      status: 'ACTIVE'
    }
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof patientSchema>) => {
      const formattedData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      };
      if (patient?.id) {
        return patientService.update(patient.id, formattedData);
      }
      return patientService.create(formattedData);
    },
    onSuccess: () => {
      // Refresh the patients list
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error('Error saving patient:', error);
      const errData = error.response?.data;
      if (errData?.message?.includes('CIN')) {
        form.setError('cin', { type: 'manual', message: 'Ce CIN existe déjà' });
      } else if (errData?.errors && Array.isArray(errData.errors)) {
        errData.errors.forEach((err: any) => {
          if (err.path && err.path[0]) {
            form.setError(err.path[0] as any, { type: 'manual', message: err.message });
          }
        });
      }
    }
  });

  const onSubmit = (data: z.infer<typeof patientSchema>) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CIN */}
        <div className="space-y-2">
          <Label htmlFor="cin">CIN *</Label>
          <Input 
            id="cin" 
            placeholder="Ex: AB123456" 
            {...form.register('cin')} 
            disabled={!!patient}
          />
          {form.formState.errors.cin && (
            <p className="text-sm text-destructive">{form.formState.errors.cin.message}</p>
          )}
        </div>

        {/* Sexe */}
        <div className="space-y-2">
          <Label htmlFor="gender">Sexe *</Label>
          <Select 
            onValueChange={(val) => { if (val) form.setValue('gender', val as "M" | "F") }} 
            defaultValue={form.getValues('gender')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.gender && (
            <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>
          )}
        </div>

        {/* Prénom */}
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input 
            id="firstName" 
            placeholder="Jean" 
            {...form.register('firstName')} 
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input 
            id="lastName" 
            placeholder="Dupont" 
            {...form.register('lastName')} 
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
          )}
        </div>

        {/* Date de naissance */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date de naissance *</Label>
          <Input 
            id="dateOfBirth" 
            type="date"
            {...form.register('dateOfBirth')} 
          />
          {form.formState.errors.dateOfBirth && (
            <p className="text-sm text-destructive">{form.formState.errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Téléphone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            id="phone" 
            placeholder="06 12 34 56 78" 
            {...form.register('phone')} 
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="patient@email.com" 
            {...form.register('email')} 
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        
        {/* Mutuelle */}
        <div className="space-y-2">
          <Label htmlFor="mutuelle">Mutuelle</Label>
          <Input 
            id="mutuelle" 
            placeholder="Ex: CNOPS, CNSS..." 
            {...form.register('mutuelle')} 
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            form.reset();
            if (onSuccess) onSuccess();
          }}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Enregistrement...' : patient ? 'Mettre à jour' : 'Enregistrer le patient'}
        </Button>
      </div>
    </form>
  );
}
