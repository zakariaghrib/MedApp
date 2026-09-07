const patientService = require('./patient.service');
const { createPatientSchema, updatePatientSchema } = require('./patient.dto');

class PatientController {
  
  async create(req, res) {
    try {
      // 1. Validation des données
      const validatedData = createPatientSchema.parse(req.body);
      
      // 2. Appel au service
      const patient = await patientService.createPatient(validatedData);
      
      // 3. Réponse
      return res.status(201).json({
        success: true,
        message: 'Patient créé avec succès',
        data: patient
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      if (error.message.includes('existe déjà')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Erreur interne du serveur', error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const result = await patientService.getAllPatients(req.query);
      return res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const patient = await patientService.getPatientById(req.params.id);
      return res.status(200).json({ success: true, data: patient });
    } catch (error) {
      if (error.message === 'Patient non trouvé') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const validatedData = updatePatientSchema.parse(req.body);
      const patient = await patientService.updatePatient(req.params.id, validatedData);
      
      return res.status(200).json({
        success: true,
        message: 'Patient mis à jour avec succès',
        data: patient
      });
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      if (error.message === 'Patient non trouvé') {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message.includes('déjà utilisé')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  async archive(req, res) {
    try {
      const patient = await patientService.archivePatient(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Patient archivé avec succès',
        data: patient
      });
    } catch (error) {
      if (error.message === 'Patient non trouvé') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await patientService.deletePatient(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Patient supprimé avec succès'
      });
    } catch (error) {
      if (error.message === 'Patient non trouvé') {
        return res.status(404).json({ success: false, message: error.message });
      }
      return res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  }
}

module.exports = new PatientController();
