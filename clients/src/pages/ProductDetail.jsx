import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Handle loading state
  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  // Find product
  // Allow matching by MongoDB _id (string) or fallback static id (number)
  const product = products.find((p) => p._id === id || p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>
        <Link to="/shop" className="text-primary hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isInWishlist = (product) =>
    wishlistItems.some(
      (item) => item._id === product._id || item.id === product.id,
    );

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === "increase") {
      setQuantity(quantity + 1);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product)) {
      dispatch(removeFromWishlist(product._id || product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      dispatch(addToCartLocal({ product, quantity }));
      navigate("/cart");
      return;
    }
    // Dispatch action to add to cart
    dispatch(addToCartAsync({ productId: product._id, quantity }));
    // Navigate to cart
    navigate("/cart");
  };

  return (
    <div className="bg-secondary/10 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/shop"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="text-sm font-medium text-gray-500">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-primary">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>

        {/* Product Top Section */}
        <div className="bg-white rounded-[2rem] p-6 lg:p-12 shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Product Image */}
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-50">
              <img
                src={getProductImageUrl(product)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-accent text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-md">
                Best Seller
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-current"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-600">
                  {product.rating} (128 Reviews)
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="text-3xl font-black text-primary mb-6">
                ${product.price}
              </div>

              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                {product.description ||
                  `Experience the ultimate in skincare with our ${product.name}. Formulated with premium ingredients to nourish, protect, and revitalize your skin for a healthy, glowing complexion every day.`}
              </p>

              {/* Quantity & Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-100 w-full sm:w-auto">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary transition-colors bg-white rounded-xl shadow-sm"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary transition-colors bg-white rounded-xl shadow-sm"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors border border-gray-100 ${
                    isInWishlist(product)
                      ? "bg-red-50 text-red-500 border-red-100"
                      : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  <Heart size={24} />
                </button>
              </div>

              {/* Features/Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Truck size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Free Shipping
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    Secure Payment
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <RefreshCw size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    30-Day Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-[2rem] p-6 lg:p-12 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-8 border-b border-gray-100 mb-8 pb-4">
            {["description", "ingredients", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-bold capitalize pb-4 -mb-4 transition-colors ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-gray-600 leading-relaxed max-w-4xl">
            {activeTab === "description" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p>
                  {product.description ||
                    `Elevate your daily routine with our premium ${product.name}. This expertly crafted formula is designed to deliver deep hydration and lasting protection. Suitable for all skin types, it absorbs quickly without leaving any greasy residue.`}
                </p>
                <p>
                  Our commitment to quality means we only use the finest,
                  ethically sourced ingredients. Regular use helps to improve
                  skin texture, reduce the appearance of fine lines, and promote
                  a radiant, youthful glow.
                </p>
              </div>
            )}
            {activeTab === "ingredients" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p>
                  Aqua (Water), Glycerin, Niacinamide, Sodium Hyaluronate,
                  Panthenol, Tocopherol (Vitamin E), Aloe Barbadensis Leaf
                  Juice, Camellia Sinensis Extract, Citric Acid, Phenoxyethanol,
                  Ethylhexylglycerin.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>
                    <strong>100% Vegan & Cruelty-Free</strong>
                  </li>
                  <li>
                    <strong>Free from Parabens & Sulfates</strong>
                  </li>
                  <li>
                    <strong>Dermatologically Tested</strong>
                  </li>
                </ul>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Mock Review */}
                <div className="border-b border-gray-100 pb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                      JD
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Jane Doe</h4>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-sm text-gray-400">
                      2 days ago
                    </span>
                  </div>
                  <p className="text-gray-600">
                    Absolutely love this product! It has completely transformed
                    my skin. Will definitely be purchasing again.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Related Products
            </h2>
            <Link to="/shop" className="text-primary font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter((p) => (p._id || p.id) !== (product._id || product.id))
              .slice(0, 4)
              .map((relatedProduct) => (
                <div
                  key={relatedProduct._id || relatedProduct.id}
                  className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-primary/20 flex flex-col"
                >
                  <Link
                    to={`/product/${relatedProduct._id || relatedProduct.id}`}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 block"
                  >
                    <img
                      src={getProductImageUrl(relatedProduct)}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Hover Actions */}
                    <div
                      className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!user) {
                          alert("Please login to add items to cart");
                          return;
                        }
                        dispatch(
                          addToCartAsync({
                            productId: relatedProduct._id,
                            quantity: 1,
                          }),
                        );
                      }}
                    >
                      <button className="w-full py-3 bg-white/90 backdrop-blur-md text-gray-900 font-bold rounded-xl shadow-lg hover:bg-primary hover:text-white transition-colors flex justify-center items-center gap-2">
                        <ShoppingBag size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </Link>

                  <div className="space-y-1 px-2 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      <Star
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-xs font-bold text-gray-600">
                        {relatedProduct.rating || 4.5}
                      </span>
                    </div>
                    <Link
                      to={`/product/${relatedProduct._id || relatedProduct.id}`}
                      className="font-bold text-gray-900 hover:text-primary transition-colors text-lg truncate block"
                    >
                      {relatedProduct.name}
                    </Link>
                    <div className="text-xl font-black text-gray-900 mt-auto">
                      ${relatedProduct.price}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
