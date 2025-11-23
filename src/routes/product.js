import express from "express";
import { prisma } from "../prisma.js";
import { isAdmin } from "../middlewares/auth.js"; 

const router = express.Router();


// Créer un produit (admin)
router.post("/", isAdmin, async (req, res) => {
  const { name, description, price, stock } = req.body; // <-- ajoute stock
  if (!name || !description || price == null || stock == null)
    return res.status(400).json({ error: "Tous les champs sont requis" });

  try {
    const product = await prisma.product.create({
      data: { name, description, price, stock }, // <-- ajoute stock
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /products → tous les produits
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /products/:id → produit par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) return res.status(404).json({ error: "Produit non trouvé" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /products/:id - Modifier un produit
router.put("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price, stock },
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur ou produit introuvable" });
  }
});

// DELETE /products/:id - Supprimer un produit
router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur ou produit introuvable" });
  }
});



export default router;
