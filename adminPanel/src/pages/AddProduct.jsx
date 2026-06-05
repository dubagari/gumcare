import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Upload,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProduct } from "../redux/productSlice";

const MAX_IMAGES = 5;

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Skincare",
    brand: "",
    countInStock: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFileHandler = async (e) => {
    const files = e.target.files;

    setImageError("");

    if (files.length > MAX_IMAGES) {
      setImageError(`You can upload maximum ${MAX_IMAGES} images.`);
      return;
    }

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("images", files[i]);
    }

    setUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        images: result.images,
      }));
    } catch (err) {
      setImageError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      setImageError("Please upload at least one image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      };

      await dispatch(createProduct(productData)).unwrap();
      navigate("/dashboard/products");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          to="/dashboard/products"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Product
          </h1>
          <p className="text-gray-500">
            Fill in the details below to add a product.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">
                Product Information
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                />

                <textarea
                  name="description"
                  required
                  rows="5"
                  placeholder="Product Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">Pricing & Stock</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  className="p-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                />

                <input
                  type="number"
                  name="countInStock"
                  required
                  placeholder="Stock"
                  value={formData.countInStock}
                  onChange={handleChange}
                  className="p-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* IMAGE UPLOAD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Images</h2>
                <span className="text-sm text-gray-500">
                  {formData.images.length}/{MAX_IMAGES}
                </span>
              </div>

              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
                <Upload className="mb-2 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload (max {MAX_IMAGES})
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>

              {uploading && (
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </div>
              )}

              {imageError && (
                <p className="text-sm text-red-500 mt-2">{imageError}</p>
              )}

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {formData.images.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000${img}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CATEGORY */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">Category & Brand</h2>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none mb-4"
              >
                <option>Skincare</option>
                <option>Body & Bath</option>
                <option>Fragrance</option>
                <option>Tools</option>
              </select>

              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {isSubmitting ? "Saving..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
