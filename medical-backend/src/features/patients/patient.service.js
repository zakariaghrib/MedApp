const prisma = require('../../config/db');

class PatientService {
  /**
   * Créer un nouveau patient
   */
  async createPatient(data) {
    // Vérifier si le CIN existe déjà
    if (data.cin) {
      const existingPatient = await prisma.patient.findUnique({
        where: { cin: data.cin }
      });
      if (existingPatient) {
        throw new Error('Un patient avec ce CIN existe déjà');
      }
    }

    return await prisma.patient.create({
      data
    });
  }

  /**
   * Récupérer les patients avec pagination, recherche, filtrage et tri
   */
  async getAllPatients(params = {}) {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = params;
    
    const skip = (page - 1) * limit;

    // Construire la clause Where
    const where = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { cin: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Effectuer les requêtes en parallèle (données et count)
    const [data, total] = await prisma.$transaction([
      prisma.patient.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.patient.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Récupérer un patient par son ID
   */
  async getPatientById(id) {
    const patient = await prisma.patient.findUnique({
      where: { id }
    });

    if (!patient) {
      throw new Error('Patient non trouvé');
    }

    return patient;
  }

  /**
   * Mettre à jour un patient
   */
  async updatePatient(id, data) {
    // Vérifier l'existence
    await this.getPatientById(id);

    // Si on met à jour le CIN, vérifier le conflit
    if (data.cin) {
      const existing = await prisma.patient.findUnique({
        where: { cin: data.cin }
      });
      if (existing && existing.id !== id) {
        throw new Error('Ce CIN est déjà utilisé par un autre patient');
      }
    }

    return await prisma.patient.update({
      where: { id },
      data
    });
  }

  /**
   * Archiver (Soft Delete) un patient
   */
  async archivePatient(id) {
    await this.getPatientById(id);

    return await prisma.patient.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });
  }

  /**
   * Supprimer définitivement un patient
   */
  async deletePatient(id) {
    await this.getPatientById(id);

    return await prisma.patient.delete({
      where: { id }
    });
  }
}

module.exports = new PatientService();
