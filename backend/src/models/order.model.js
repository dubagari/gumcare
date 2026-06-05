import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customer: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
    },

    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    totalAmount: Number,

    orderStatus: {
      type: String,
      default: "pending",
    },

    paymentStatus: {
      type: String,
      default: "unpaid", // FIXED
    },

    paymentReference: String,
    paymentData: Object,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
