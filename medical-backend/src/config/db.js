// src/config/db.js
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Récupération de l'URL depuis les variables d'environnement
const connectionString = process.env.DATABASE_URL;

// Configuration du pool de connexion PostgreSQL
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Initialisation de Prisma avec l'adaptateur
const prisma = new PrismaClient({ adapter });

module.exports = prisma;