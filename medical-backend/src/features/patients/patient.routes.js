const express = require('express');
const router = express.Router();
const patientController = require('./patient.controller');

// Optionally, you can add authentication middlewares here
// const authMiddleware = require('../../shared/middlewares/auth.middleware');
// router.use(authMiddleware);

// Créer un patient
router.post('/', patientController.create);

// Récupérer tous les patients
router.get('/', patientController.getAll);

// Récupérer un patient par son ID
router.get('/:id', patientController.getById);

// Mettre à jour un patient
router.put('/:id', patientController.update);

// Archiver un patient
router.patch('/:id/archive', patientController.archive);

// Supprimer un patient définitivement
router.delete('/:id', patientController.delete);

module.exports = router;
