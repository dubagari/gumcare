// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    amount: Number,

    method: String,

    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },

    transactionId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);