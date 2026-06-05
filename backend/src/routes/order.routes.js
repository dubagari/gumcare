import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyUser, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(verifyUser, addOrderItems).get(verifyAdmin, getOrders);
router.route("/myorders").get(verifyUser, getMyOrders);
router.route("/:id").get(verifyUser, getOrderById);
router.route("/:id/pay").put(verifyUser, updateOrderToPaid);
router.route("/:id/status").put(verifyAdmin, updateOrderStatus);

export default router;
