import { z } from 'zod';

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Veuillez sélectionner un patient'),
  dateTime: z.string().min(1, 'La date et l\'heure sont requises'),
  reason: z.string().optional(),
  status: z.enum(['SCHEDULED', 'WAITING', 'COMPLETED', 'CANCELED']).optional().default('SCHEDULED'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export type Appointment = AppointmentFormData & {
  id: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
  };
};
