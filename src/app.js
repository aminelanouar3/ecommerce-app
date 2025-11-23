import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";

dotenv.config();

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

export default app;
