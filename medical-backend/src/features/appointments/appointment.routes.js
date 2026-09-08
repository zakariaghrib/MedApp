const express = require('express');
const router = express.Router();
const appointmentController = require('./appointment.controller');

// Récupérer les rendez-vous
router.get('/', appointmentController.getAll);

// Créer un rendez-vous
router.post('/', appointmentController.create);

// Mettre à jour le statut d'un rendez-vous
router.put('/:id/status', appointmentController.updateStatus);

// Supprimer un rendez-vous
router.delete('/:id', appointmentController.delete);

module.exports = router;
