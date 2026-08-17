import { z } from 'zod';

export const patientSchema = z.object({
  cin: z.string().min(1, 'CIN est requis'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  dateOfBirth: z.string().min(1, 'La date de naissance est requise'),
  gender: z.enum(['M', 'F'], { message: 'Le sexe est requis (M ou F)' }),
  phone: z.string().optional(),
  email: z.string().email('Format email invalide').optional().or(z.literal('')),
  address: z.string().optional(),
  mutuelle: z.string().optional(),
  bloodGroup: z.string().optional(),
  medicalHistory: z.string().optional(),
  chronicConditions: z.string().optional(),
  allergies: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional().default('ACTIVE'),
});

export type PatientFormData = z.infer<typeof patientSchema>;

export type Patient = PatientFormData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
