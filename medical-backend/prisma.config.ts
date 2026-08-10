import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Chemin vers ton fichier de schéma
  schema: "prisma/schema.prisma",
  
  // Dossier où seront stockées les migrations SQL
  migrations: {
    path: "prisma/migrations",
  },
  
  // Connexion à ta base de données PostgreSQL (Docker)
  datasource: {
    url: process.env.DATABASE_URL,
  },
});