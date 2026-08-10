const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/db');

const register = async (userData) => {
  const { firstName, lastName, email, password, role } = userData;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  // Hasher le mot de passe
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Créer l'utilisateur dans la base de données
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      role: role || 'SECRETARY' // Rôle par défaut si non fourni
    }
  });

  return { id: user.id, email: user.email, role: user.role };
};

const login = async (email, password) => {
  // Chercher l'utilisateur par son email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Identifiants invalides');
  }

  // Comparer le mot de passe fourni avec le hash en base de données
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Identifiants invalides');
  }

  // Générer le token JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Le token expire dans 1 jour
  );

  return { 
    token, 
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role } 
  };
};

module.exports = { register, login };