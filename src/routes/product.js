import express from "express";
import { prisma } from "../prisma.js";

const router = express.Router();

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

export default router;
