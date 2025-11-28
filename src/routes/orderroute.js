import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrdersByStatus,
  deleteOrder
} from "../controllers/ordercontroller.js";

import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create",  createOrder);
router.get("/user/:userId", getOrders);
router.get("/",isAdmin,getAllOrders);
router.get("/status/:status", isAdmin, getOrdersByStatus);
router.patch("/status/:orderId",isAdmin, updateOrderStatus);
router.delete("/:orderId", isAdmin, deleteOrder);


export default router;
