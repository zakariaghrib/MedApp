const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // On vérifie si l'en-tête Authorization est présent et commence par "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // On extrait le token
  }

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // On attache les informations de l'utilisateur à l'objet request
    req.user = decoded; 
    
    next(); // On passe à la suite
  } catch (error) {
    res.status(401).json({ error: 'Accès non autorisé, token invalide' });
  }
};

module.exports = { protect };