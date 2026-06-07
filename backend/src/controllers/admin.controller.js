import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    // run in parallel (faster)
    const [userCount, productCount, orderCount, revenueResult] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
            },
          },
        ]),
      ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalRevenue,
      activeUsers: userCount,
      totalOrders: orderCount,
      totalProducts: productCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
