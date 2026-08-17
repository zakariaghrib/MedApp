const { z } = require('zod');

const createPatientSchema = z.object({
  cin: z.string().min(1, 'CIN est requis'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  dateOfBirth: z.string().datetime({ message: "La date de naissance doit être au format ISO 8601" }).or(z.date()),
  gender: z.enum(['M', 'F'], { required_error: 'Le sexe est requis (M ou F)' }),
  phone: z.string().optional(),
  email: z.string().email('Format email invalide').optional().or(z.literal('')),
  address: z.string().optional(),
  mutuelle: z.string().optional(),
  bloodGroup: z.string().optional(),
  medicalHistory: z.string().optional(),
  chronicConditions: z.string().optional(),
  allergies: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
});

const updatePatientSchema = createPatientSchema.partial();

module.exports = {
  createPatientSchema,
  updatePatientSchema
};
