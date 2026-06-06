import {
  ArrowRight,
  ChevronDown,
  Filter,
  ShoppingBag,
  Star,
  Loader2,
  Heart,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { categories } from "../data"; // Kept categories for UI
import { addToCartAsync, addToCartLocal } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { fetchProducts } from "../redux/productSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getProductImageUrl = (product) => {
  let imagePath = "";

  if (product.images && product.images.length > 0) {
    imagePath = product.images[0];
  } else if (typeof product.image === "string") {
    imagePath = product.image;
  } else if (Array.isArray(product.image) && product.image.length > 0) {
    imagePath = product.image[0];
  }

  if (!imagePath) return "https://via.placeholder.com/400";
  if (imagePath.startsWith("http")) return imagePath;

  return `${BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

const Shop = () => {
  const [priceRange, setPriceRange] = useState(100);
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const safeWishlist = Array.isArray(wishlistItems) ? wishlistItems : [];

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!user) {
      dispatch(addToCartLocal({ product, quantity: 1 }));
      return;
    }
    dispatch(addToCartAsync({ productId: product._id, quantity: 1 }));
  };

  const isInWishlist = (product) =>
    safeWishlist.some(
      (item) => item?._id === product?._id || item?.id === product?.id,
    );

  // const isInWishlist = (product) =>
  //   safeWishlist.some(
  //     (item) => item._id === product._id || item.id === product.id,
  //   );

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();

    if (isInWishlist(product)) {
      dispatch(removeFromWishlist(product._id || product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };
  return (
    <div className="bg-secondary/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shop All Products
          </h1>
          <p className="text-gray-500">
            Discover our full range of premium skincare solutions.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <Filter size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            </div>

            {/* Categories Filter */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((cat, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-gray-600 group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                      {cat.items.split("+")[0]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>$0</span>
                  <span className="text-primary font-bold">${priceRange}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Rating</h3>
              <div className="space-y-3">
                {[5, 4, 3].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4 border-gray-300 text-primary focus:ring-primary accent-primary"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">& Up</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full mt-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all">
              Apply Filters
            </button>
          </aside>

          {/* Product Grid Area */}
          <div className="w-full lg:w-3/4">
            {/* Top Bar (Sorting & Results) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-gray-500 font-medium text-sm">
                Showing 1–12 of 48 results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="relative">
                  <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium cursor-pointer">
                    <option>Latest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Popularity</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Products */}
            {status === "loading" ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 size={48} className="animate-spin mb-4 text-primary" />
                <p>Loading products...</p>
              </div>
            ) : status === "failed" ? (
              <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 text-center">
                <p className="font-bold">Failed to load products</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p>No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id || product.id}
                    className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-primary/20 flex flex-col"
                  >
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 block"
                    >
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Hover Actions */}
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                        <div className="flex items-center gap-3">
                          <button
                            className="flex-1 py-3 bg-white/90 backdrop-blur-md text-gray-900 font-bold rounded-xl shadow-lg hover:bg-primary hover:text-white transition-colors flex justify-center items-center gap-2"
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            <ShoppingBag size={18} />
                            Add to Cart
                          </button>
                          <button
                            onClick={(e) => handleToggleWishlist(e, product)}
                            className={`w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center transition-all ${
                              isInWishlist(product)
                                ? "bg-red-50 text-red-500 border-red-100"
                                : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
                            }`}
                          >
                            <Heart size={18} />
                          </button>
                        </div>
                      </div>
                    </Link>

                    <div className="space-y-1 px-2 flex-1 flex flex-col">
                      <div className="flex items-center gap-1 mb-2">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span className="text-xs font-bold text-gray-600">
                          {product.rating || 4.5}
                        </span>
                      </div>
                      <Link
                        to={`/product/${product._id || product.id}`}
                        className="font-bold text-gray-900 hover:text-primary transition-colors text-lg truncate block"
                      >
                        {product.name}
                      </Link>
                      <div className="text-xl font-black text-gray-900 mt-auto">
                        ${product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center shadow-md">
                1
              </button>
              <button className="w-10 h-10 rounded-xl bg-white text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center border border-gray-200">
                2
              </button>
              <button className="w-10 h-10 rounded-xl bg-white text-gray-600 font-bold hover:bg-gray-50 flex items-center justify-center border border-gray-200">
                3
              </button>
              <button className="w-10 h-10 rounded-xl bg-white text-gray-600 hover:text-primary hover:bg-gray-50 flex items-center justify-center border border-gray-200 group">
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
