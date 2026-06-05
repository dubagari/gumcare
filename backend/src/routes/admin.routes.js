import express from "express";
import {
  getDashboardStats,
  getUsers,
  deleteUser,
} from "../controllers/admin.controller.js";
import { signupAdmin, loginAdmin } from "../controllers/auth.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signupadmin", signupAdmin);
router.post("/loginadmin", loginAdmin);

router.get("/stats", verifyAdmin, getDashboardStats);
router.get("/users", verifyAdmin, getUsers);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
