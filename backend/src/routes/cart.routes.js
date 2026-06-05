import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyUser, getCart);
router.post("/add", verifyUser, addToCart);
router.delete("/remove/:productId", verifyUser, removeFromCart);

export default router;

