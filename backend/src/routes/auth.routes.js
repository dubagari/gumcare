import express from "express";
import {
  signupUser,
  signupAdmin,
  loginUser,
  loginAdmin,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signupuser", signupUser);
router.post("/loginuser", loginUser);
router.post("/loginadmin", loginAdmin);

export default router;
