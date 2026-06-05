import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// INITIATE PAYMENT
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, email, orderId, callback_url } = req.body;

    if (!amount || !email || !orderId) {
      return res
        .status(400)
        .json({ message: "Amount, email, and orderId are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const userId = req.user?.id || req.user?._id;
    if (String(order.user) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized for this order" });
    }

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          callback_url: callback_url || undefined,
          metadata: { orderId },
        }),
      },
    );

    const data = await response.json();

    if (!data.status) {
      return res
        .status(400)
        .json({
          message: data.message || "Paystack initialization error",
          details: data,
        });
    }

    res.json(data);
  } catch (error) {
    console.error("PAYSTACK INIT ERROR:", error);
    res
      .status(500)
      .json({
        message: "Paystack initialization failed",
        error: error.message,
      });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const { reference, orderId } = req.body;

    if (!reference || !orderId) {
      return res.status(400).json({ message: "Missing reference or orderId" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const userId = req.user?.id || req.user?._id;
    if (String(order.user) !== String(userId)) {
      return res.status(403).json({ message: "Not authorized for this order" });
    }

    const url = `https://api.paystack.co/transaction/verify/${reference}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== "success") {
      return res.status(400).json({ message: "Payment failed", details: data });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: reference,
      status: data.data.status,
      update_time: data.data.transaction_date,
      email_address: data.data.customer?.email,
    };

    const updatedOrder = await order.save();

    res.json({ message: "Payment verified", order: updatedOrder });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res
      .status(500)
      .json({ message: "Verification error", error: error.message });
  }
};
