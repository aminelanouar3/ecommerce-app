// Middleware temporaire pour tester les routes admin
export const isAdmin = (req, res, next) => {
  // pour l'instant on laisse passer tout le monde
  next();
};
