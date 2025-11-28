import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cartcontroller.js";






const router = express.Router();
//routes
router.get("/:userId", getCart);
router.post("/add", addToCart);
router.put("/item/:id", updateCartItem);
router.delete("/item/:id", removeCartItem);
router.delete("/clear/:userId", clearCart);

export default router;
