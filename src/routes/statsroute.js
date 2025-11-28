import express from "express";
import {
  getTotalSales,
  getOrderCount,
  getPopularProducts,
  getAllStats
} from "../controllers/statscontroller.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// All routes are admin-only
router.get("/total-sales", isAdmin, getTotalSales);
router.get("/order-count", isAdmin, getOrderCount);
router.get("/popular-products", isAdmin, getPopularProducts);
router.get("/all", isAdmin, getAllStats); // combined stats for dashboard

export default router;
