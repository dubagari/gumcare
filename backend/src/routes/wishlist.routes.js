import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyUser, getWishlist);
router.post("/", verifyUser, addToWishlist);
router.delete("/clear", verifyUser, clearWishlist);
router.delete("/:productId", verifyUser, removeFromWishlist);

export default router;
