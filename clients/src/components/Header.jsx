import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  User,
  ShoppingCart,
  Search,
  ChevronDown,
  Home,
  Menu,
  LogOut,
  User2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";

import { logout, reset } from "../redux/authSlice";
import { clearCartLocal } from "../redux/cartSlice";
import { clearWishlist } from "../redux/wishlistSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  console.log(user);

  // const onLogout = () => {
  //   dispatch(logout());
  //   dispatch(reset());
  //   navigate("/");
  // };

  const onLogout = () => {
    dispatch(clearCartLocal());
    dispatch(clearWishlist());
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <nav className="p-3 border-b border-gray-200">
        <div className="flex justify-between items-center  max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#53C6E2] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#53C6E2] to-[#53C6E2]">
              Gumcare
            </h2>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative flex items-center h-11 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#53C6E2] focus-within:ring-1 focus-within:ring-[#53C6E2] transition-all">
              {/* Category Dropdown */}
              <div className="hidden sm:flex items-center gap-1 px-4 h-full bg-gray-100 border-r border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors group">
                <span className="text-sm font-medium text-gray-700">All</span>
                <ChevronDown
                  size={16}
                  className="text-gray-500 group-hover:text-gray-700"
                />
              </div>

              {/* Input Field */}
              <div className="flex-1 flex items-center px-4">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search products, brands and categories..."
                  className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-500"
                />
              </div>

              {/* Search Button */}
              <button className="h-full px-6 bg-[#53C6E2] text-white text-sm font-semibold hover:bg-[#74cae2] transition-colors">
                Search
              </button>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/wishlist"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative group"
            >
              <Heart
                size={20}
                className="group-hover:text-[#53C6E2] transition-colors"
              />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[1rem] h-4 bg-[#53C6E2] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative group"
            >
              <ShoppingCart
                size={20}
                className="group-hover:text-[#53C6E2] transition-colors"
              />
              {cartTotalQuantity > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#53C6E2] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                  {cartTotalQuantity || 0}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-gray-200">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Account
                  </span>
                  {/* <span className="text-sm font-bold text-gray-900">
                    {user?.name || "Guest"}
                  </span> */}

                  {user?.name && (
                    <span className="text-sm font-bold text-gray-900">
                      {user.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all group"
                  title="Logout"
                >
                  <LogOut
                    size={18}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-gray-200 group"
              >
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-[#53C6E2] group-hover:text-white transition-all">
                  <User size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700 hidden sm:block group-hover:text-[#53C6E2]">
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <nav className="bg-gray-50/50 py-2 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-8">
            {/* All Categories Toggle */}
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#53C6E2] text-white rounded-lg hover:bg-[#74cae2] transition-colors shadow-sm">
              <Menu size={20} />
              <span className="text-sm font-semibold">All Categories</span>
            </button>

            {/* Quick Links */}
            <div className="hidden lg:flex items-center gap-6">
              {[
                "Top Deals",
                "Brand",
                "New Arrivals",
                "Best Sellers",
                "Today's Offer",
              ].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm font-medium text-gray-600 hover:text-[#53C6E2] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Delivery Location */}
          <div className="flex items-center gap-2 py-1 px-3 hover:bg-gray-200/50 rounded-lg cursor-pointer transition-colors group">
            <span className="text-xs text-gray-500 font-medium">
              Deliver to
            </span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-900">Nigeria</span>
              <ChevronDown
                size={14}
                className="text-gray-400 group-hover:text-gray-900 transition-colors"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
