import Wishlist from "../models/wishlist.model.js";

// GET wishlist
// export const getWishlist = async (req, res) => {
//   const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
//     "items.productId",
//   );

//   if (!wishlist) {
//     return res.json({ user: req.user._id, items: [] });
//   }

//   res.json(wishlist);
// };

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "items.productId",
  );

  const items = wishlist?.items?.map((i) => i.productId) || [];

  res.json(items);
};

// ADD item
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      items: [{ productId }],
    });
  } else {
    const exists = wishlist.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (!exists) {
      wishlist.items.push({ productId });
      await wishlist.save();
    }
  }

  res.json(wishlist);
};

// REMOVE item
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) return res.json({ items: [] });

  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  await wishlist.save();

  res.json(wishlist);
};

// CLEAR wishlist
export const clearWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (wishlist) {
    wishlist.items = [];
    await wishlist.save();
  }

  res.json({ message: "Wishlist cleared" });
};
