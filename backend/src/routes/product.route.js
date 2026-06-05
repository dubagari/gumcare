// routes/product.routes.js

import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/product.controller.js";

import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN ROUTES
router.post("/", verifyAdmin, createProduct);
router.put("/:id", verifyAdmin, updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

router.get("/categories", getCategories);
router.get("/:id", getProductById);

export default router;
