const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./features/auth/auth.routes'); // Import des routes

const app = express();

app.use(cors());
app.use(express.json());

// Branchement de nos routes d'authentification
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API du cabinet médical opérationnelle' });
});

module.exports = app;