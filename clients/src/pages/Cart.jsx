import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import {
  fetchCart,
  addToCartAsync,
  removeFromCartAsync,
  getTotals,
  updateCartQuantityLocal,
  removeFromCartLocal,
  clearCartLocal,
} from "../redux/cartSlice";
import PaystackCheckout from "../components/PaystackCheckout";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getProductImageUrl = (product) => {
  if (!product) return "https://via.placeholder.com/400";

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

const Cartpage = () => {
  const { cartItems, cartTotalQuantity, cartTotalAmount, loading, error } =
    useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("Paystack");
  const [checkoutOrder, setCheckoutOrder] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const token = user?.token || user?.user?.token;

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  console.log(user);

  useEffect(() => {
    dispatch(clearCartLocal());

    if (user?.token) {
      dispatch(fetchCart());
    } else {
      dispatch(getTotals());
    }
  }, [user?.token, dispatch]);

  const getOrderItemsPayload = () => {
    return (cartItems || []).map((item) => {
      const product = item?.productId;
      const price =
        typeof product?.price === "string"
          ? parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
          : product?.price || 0;

      return {
        name: product?.name || "Unknown Product",
        qty: item.quantity || 1,
        image: product?.images?.[0] || product?.image || "",
        price,
        product: product?._id || product,
      };
    });
  };

  const createOrderPayload = () => ({
    orderItems: getOrderItemsPayload(),
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    paymentMethod,
    totalPrice: total,
  });

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) return;

    if (!user) {
      alert("Please login to complete checkout.");
      navigate("/login");
      return;
    }

    setCheckoutMessage("");
    setIsProcessing(true);

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createOrderPayload()),
      });

      const created = await res.json();

      if (!res.ok) {
        throw new Error(created.message || "Checkout failed");
      }

      const preparedOrder = {
        _id: created._id,
        items: (created.orderItems || []).map((it) => ({
          id: it.product || it._id || it.productId,
          name: it.name,
          quantity: it.qty || it.quantity || 1,
          price: it.price,
        })),
        totalAmount: created.totalPrice || created.totalAmount || total,
        customer: {
          fullName: user?.name || "Customer",
          email: user?.email || "",
          phone: user?.phone || "",
          address:
            (created.shippingAddress && created.shippingAddress.address) || "",
        },
      };

      setCheckoutOrder(preparedOrder);

      if (paymentMethod === "Cash on Delivery") {
        setCheckoutMessage(
          "Order created successfully. Please pay on delivery.",
        );
        dispatch(clearCartLocal());
        navigate("/order-success", { state: { order: preparedOrder } });
      } else {
        setCheckoutMessage("Order created. Complete payment below.");
      }
    } catch (error) {
      setCheckoutMessage(
        error?.response?.data?.message || error.message || "Checkout failed.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    if (!checkoutOrder?._id) return;
    setCheckoutMessage("");
    setIsProcessing(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/orders/${checkoutOrder._id}/pay`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            id:
              paymentData?.reference ||
              paymentData?.transaction ||
              paymentData?.id,
            status: "success",
            update_time: new Date().toISOString(),
            email_address: user?.email || checkoutOrder?.customer?.email,
          }),
        },
      );

      const updated = await res.json();

      if (!res.ok) {
        throw new Error(updated.message || "Payment failed");
      }

      const preparedOrder = {
        _id: updated._id,
        items: (updated.orderItems || []).map((it) => ({
          id: it.product || it._id || it.productId,
          name: it.name,
          quantity: it.qty || it.quantity || 1,
          price: it.price,
        })),
        totalAmount: updated.totalPrice || updated.totalAmount || total,
        customer: checkoutOrder?.customer || {
          fullName: user?.name,
          email: user?.email,
        },
      };

      setCheckoutOrder(preparedOrder);
      setCheckoutMessage("Payment completed successfully. Thank you!");
      dispatch(clearCartLocal());
      navigate("/order-success", { state: { order: preparedOrder } });
    } catch (error) {
      setCheckoutMessage(
        error?.response?.data?.message || error.message || "Payment failed.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFromCart = (productId) => {
    if (user) {
      dispatch(removeFromCartAsync(productId));
    } else {
      dispatch(removeFromCartLocal(productId));
    }
  };

  // const handleQuantityChange = (productId, qty) => {
  //   if (user) {
  //     dispatch(addToCartAsync({ productId, quantity: qty }));
  //   } else {
  //     dispatch(updateCartQuantityLocal({ productId, change: qty }));
  //   }
  // };

  const handleQuantityChange = (productId, qty) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    dispatch(addToCartAsync({ productId, quantity: qty }));
  };

  // Safe totals calculation for UI
  const subtotal = Number(cartTotalAmount || 0);
  const shipping = subtotal > 0 ? 15.0 : 0;
  const total = subtotal + shipping;

  if (loading && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto ">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-500">
            {!cartItems || cartItems.length === 0
              ? "Your cart is currently empty."
              : `You have ${cartTotalQuantity || 0} item(s) in your cart.`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
            Error: {error}
          </div>
        )}

        {!cartItems || cartItems.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart feels lonely.
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Before you proceed to checkout, you must add some products to your
              shopping cart.
            </p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Return to Shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3 space-y-6">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="hidden sm:grid grid-cols-12 gap-4 text-sm font-bold text-gray-400 uppercase tracking-wider pb-4 border-b border-gray-100 mb-6">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="space-y-6">
                  {cartItems.map((item, index) => {
                    const product = item?.productId;
                    if (!product) return null;

                    const price =
                      typeof product.price === "string"
                        ? parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
                        : product.price || 0;

                    const itemTotal = price * (item.quantity || 1);

                    return (
                      <div
                        key={product._id || index}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-4 border-b border-gray-50 last:border-0 last:pb-0"
                      >
                        <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                          <Link
                            to={`/product/${product._id}`}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 block"
                          >
                            <img
                              src={getProductImageUrl(product)}
                              alt={product.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                          <div>
                            <Link
                              to={`/product/${product._id}`}
                              className="font-bold text-gray-900 text-lg hover:text-primary transition-colors block mb-1"
                            >
                              {product.name || "Unknown Product"}
                            </Link>
                            <button
                              onClick={() => handleRemoveFromCart(product._id)}
                              className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="col-span-1 sm:col-span-2 sm:text-center text-gray-600 font-medium">
                          <span className="sm:hidden font-bold mr-2 text-gray-400">
                            Price:
                          </span>
                          ${price.toFixed(2)}
                        </div>

                        <div className="col-span-1 sm:col-span-2 flex sm:justify-center">
                          <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                            <button
                              onClick={() =>
                                handleQuantityChange(product._id, -1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900 text-sm">
                              {item.quantity || 0}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(product._id, 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="col-span-1 sm:col-span-2 sm:text-right font-black text-gray-900 text-lg">
                          <span className="sm:hidden font-bold mr-2 text-gray-400">
                            Total:
                          </span>
                          ${itemTotal.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                  <Link
                    to="/shop"
                    className="text-primary font-bold hover:underline flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 text-gray-600">
                  <div className="flex justify-between">
                    <span>Items</span>
                    <span className="font-bold text-gray-900">
                      {cartTotalQuantity || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-gray-900">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h3>
                  <div className="grid gap-3">
                    {[
                      { value: "Paystack", label: "Online payment (Paystack)" },
                      { value: "Cash on Delivery", label: "Cash on Delivery" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="inline-flex items-center gap-3 p-4 rounded-3xl border border-gray-200 bg-white hover:border-primary transition"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={option.value}
                          checked={paymentMethod === option.value}
                          onChange={() => setPaymentMethod(option.value)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span className="text-gray-700 font-medium">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-900 text-lg">
                      Total
                    </span>
                    <span className="text-3xl font-black text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {checkoutMessage && (
                  <div className="mb-4 rounded-3xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                    {checkoutMessage}
                  </div>
                )}

                {checkoutOrder && paymentMethod === "Paystack" ? (
                  <div className="space-y-4">
                    <PaystackCheckout
                      order={{
                        ...checkoutOrder,
                        totalAmount: total,
                      }}
                    />
                    <button
                      onClick={() => setCheckoutOrder(null)}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition"
                    >
                      Cancel payment and choose another method
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/order"
                    onClick={handleCheckout}
                    className="w-full py-4 bg-primary flex items-center justify-center text-white font-bold rounded-2xl hover:bg-primary/80 transition-all shadow-lg shadow-gray-900/20 mb-4"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : user
                        ? "Proceed to Checkout"
                        : "Login to Checkout"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cartpage;
