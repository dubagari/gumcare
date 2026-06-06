import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Loader2, X, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProductById,
  updateProductById,
} from "../redux/productSlice";
import { Link } from "react-router-dom";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Avoid double slashes - if path already starts with /, don't add another
  return imagePath.startsWith("http")
    ? imagePath
    : `${BASE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

const EditModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...product });
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            "name",
            "description",
            "price",
            "countInStock",
            "brand",
            "category",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-bold text-gray-700 mb-1 capitalize">
                {field}
              </label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none text-sm"
                />
              ) : (
                <input
                  type={
                    field === "price" || field === "countInStock"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    dispatch(deleteProductById({ id, token: user.token }));
  };

  const handleSave = (formData) => {
    dispatch(
      updateProductById({
        id: formData._id,
        data: formData,
        token: user.token,
      }),
    );
    setEditProduct(null);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={handleSave}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">
            {products.length} products in your catalog
          </p>
        </div>
        <Link
          to="add"
          className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">
                    <Loader2
                      size={32}
                      className="animate-spin mx-auto mb-2 text-primary"
                    />
                    Loading products...
                  </td>
                </tr>
              ) : status === "failed" ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          {(product.images?.[0] || product.image) && (
                            <img
                              src={getImageUrl(
                                product.images?.[0] || product.image,
                              )}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            #{product._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-900">
                      ${product.price}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${product.countInStock > 10 ? "bg-green-100 text-green-700" : product.countInStock > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                      >
                        {product.countInStock > 0
                          ? `${product.countInStock} in stock`
                          : "Out of stock"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditProduct(product)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-white">
          <span>
            Showing {filtered.length} of {products.length} products
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
