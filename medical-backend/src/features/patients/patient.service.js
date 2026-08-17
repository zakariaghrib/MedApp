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
   * Récupérer tous les patients non archivés
   */
  async getAllPatients() {
    return await prisma.patient.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
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
}

module.exports = new PatientService();
