import React from "react";
import {
  ShoppingBag,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Clock,
} from "lucide-react";
import { categories, productTabs } from "../data";
import { products } from "../data";
import { Link } from "react-router-dom";
import Timer from "../components/Timerpage";
import Timerpage from "../components/Timerpage";

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

const HomeHero = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-primary font-semibold text-sm shadow-sm border border-primary/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              New Collection 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Elevate Your{" "}
              <span className="text-primary italic">Daily Care</span> Routine
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Experience the perfect blend of nature and science. Discover our
              curated collection of premium skincare and wellness products.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to={"/shop"}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
              >
                Shop Now
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all">
                View Gallery
              </button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <img
              src="/hero_banner_ecommerce_1777928534633.png"
              alt="Hero"
              className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Truck className="text-primary" />,
              title: "Free Shipping",
              desc: "On orders over $100",
            },
            {
              icon: <ShieldCheck className="text-primary" />,
              title: "Secure Payment",
              desc: "100% secure gateway",
            },
            {
              icon: <Clock className="text-primary" />,
              title: "24/7 Support",
              desc: "Dedicated assistance",
            },
            {
              icon: <Star className="text-primary" />,
              title: "Premium Quality",
              desc: "Certified products",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-4 group cursor-default"
            >
              <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Shop by Categories
              </h2>
              <p className="text-gray-500 mt-2">
                Find exactly what your body needs
              </p>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 hover:underline">
              View All <ArrowRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="relative h-[350px] rounded-3xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-300 mb-4">{cat.items}</p>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Section */}
      <Timerpage discount={20} />

      {/* Featured Products */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-500 max-w-2xl">
                Our most loved products curated just for you. Quality
                guaranteed.
              </p>
            </div>
            <div className="flex gap-2">
              {productTabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === "All" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-primary/10"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                    <ShoppingBag size={18} className="text-gray-600" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-accent/90 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                    Best Seller
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-xs font-bold text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      {product.price}
                    </span>
                    <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular & New Arrivals */}
      <section className="py-18 bg-white">
        <div className="">
          <div>
            {/* Most Popular */}

            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Most Popular
                </h2>
                <button className="text-sm font-bold text-primary">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {products.map((cat) => (
                  <div key={cat.name} className="group cursor-pointer">
                    <div className="relative rounded-3xl overflow-hidden mb-4">
                      <img
                        src={cat.image}
                        alt="New Arrival"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full">
                        Popular
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                      Organic Cleansing Foam
                    </h3>
                    <div className="text-gray-500 text-sm font-medium mt-1">
                      $45.00
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Section */}
            <section className="py-18 my-20  bg-white">
              <div className=" ">
                <Timerpage discount={50} targetDate="2026-12-31T23:59:59" />
              </div>
            </section>

            {/* New Arrivals */}
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  New Arrivals
                </h2>
                <button className="text-sm font-bold text-primary">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {categories.map((cat) => (
                  <div key={cat.name} className="group cursor-pointer">
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4">
                      <img
                        src={cat.image}
                        alt="New Arrival"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full">
                        NEW
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                      Organic Cleansing Foam
                    </h3>
                    <div className="text-gray-500 text-sm font-medium mt-1">
                      $45.00
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-20">
        <div className=" flex items-center bg-primary h-[234px] p-4 relative overflow-hidden text-center text-white">
          <div className="relative z-10 space-y-1 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-2xl font-bold leading-tight">
              Join Our Community & Get 20% Off
            </h2>
            <p className="text-lg text-white/80">
              Subscribe to our newsletter and stay updated with the latest
              trends, <br /> exclusive offers, and expert care tips.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded-2xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 transition-all"
              />
              <button className="w-full sm:w-auto px-8 py-2 bg-white text-primary font-bold rounded-2xl hover:bg-opacity-90 transition-all shadow-xl">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-white/60">
              By subscribing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-12 bg-white border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Gumcare</span>
        </div>
        <p className="text-sm text-gray-500">
          © 2026 Gumcare Ecommerce. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomeHero;
