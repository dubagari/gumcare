import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET CART
export const getCart = async (req, res) => {
  try {
    console.log("getCart called by user:", req.user);
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId",
    );
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], totalPrice: 0 });
      await cart.save();
      cart = await Cart.findById(cart._id).populate("items.productId");
    }
    res.json(cart);
  } catch (error) {
    console.error("getCart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ADD ITEM / UPDATE QUANTITY
export const addToCart = async (req, res) => {
  try {
    console.log("addToCart called by user:", req.user, "body:", req.body);
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      // Update existing item
      cart.items[itemIndex].quantity += quantity;

      if (cart.items[itemIndex].quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      }
    } else if (quantity > 0) {
      // Add new item
      cart.items.push({ productId, quantity });
    }

    // Recalculate totalPrice
    cart.totalPrice = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        cart.totalPrice += product.price * item.quantity;
      }
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );
    res.json(updatedCart);
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// REMOVE ITEM
export const removeFromCart = async (req, res) => {
  try {
    console.log(
      "removeFromCart called by user:",
      req.user,
      "params:",
      req.params,
    );
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    // Recalculate totalPrice
    cart.totalPrice = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        cart.totalPrice += product.price * item.quantity;
      }
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );
    res.json(updatedCart);
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({ message: error.message });
  }
};
