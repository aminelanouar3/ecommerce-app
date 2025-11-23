import express from "express";
import { prisma } from "../prisma.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// GET /user → tous les users
router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /user/:id → user par ID
router.get("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, name: true, email: true, role: true }
    });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /user/:id - Supprimer un user
router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur ou utilisateur introuvable" });
  }
});


export default router;
