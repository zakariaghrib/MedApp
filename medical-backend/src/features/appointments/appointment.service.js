const prisma = require('../../config/db');

class AppointmentService {
  /**
   * Récupérer les rendez-vous avec filtres de date optionnels
   */
  async getAppointments(startDate, endDate) {
    const where = {};
    
    if (startDate && endDate) {
      where.dateTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      where.dateTime = {
        gte: new Date(startDate)
      };
    }

    return await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        dateTime: 'asc'
      }
    });
  }

  /**
   * Créer un nouveau rendez-vous
   */
  async createAppointment(data) {
    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId }
    });
    if (!patient) throw new Error('Patient not found');

    // Get any doctor for now since authentication might not be fully wired to req.user yet
    const doctor = await prisma.user.findFirst({
      where: { role: 'DOCTOR' }
    });
    
    if (!doctor && !data.userId) {
       throw new Error('No doctor found in system to assign appointment to');
    }

    return await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        userId: data.userId || doctor.id,
        dateTime: new Date(data.dateTime),
        reason: data.reason || null,
        status: data.status || 'SCHEDULED'
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  }

  /**
   * Mettre à jour le statut d'un rendez-vous
   */
  async updateStatus(id, status) {
    return await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  }

  /**
   * Annuler ou supprimer un rendez-vous
   */
  async deleteAppointment(id) {
    return await prisma.appointment.delete({
      where: { id }
    });
  }
}

module.exports = new AppointmentService();
