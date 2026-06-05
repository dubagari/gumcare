import express from "express";
import {
  createPaymentIntent,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/initialize", verifyUser, createPaymentIntent);
router.post("/verify", verifyUser, verifyPayment);

export default router;
