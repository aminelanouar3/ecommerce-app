import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import cartRoutes from "./routes/cartroute.js";
import orderRoutes from "./routes/orderroute.js";
import statsRoutes from "./routes/statsroute.js";




dotenv.config();

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/stats", statsRoutes);

export default app;
