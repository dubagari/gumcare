import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-xl font-semibold">No order data available.</h1>
        <Link to="/" className="text-blue-600 underline mt-4 block">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600">
          🎉 Order Successfully Placed!
        </h1>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase. Your order has been recorded.
        </p>
      </div>

      {/* ORDER ID */}
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <p className="font-semibold text-lg">
          Order ID: <span className="text-blue-600">{order._id}</span>
        </p>
      </div>

      {/* ORDER ITEMS */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Items Ordered</h2>
        <div className="border rounded p-4">
          {(order.orderItems || []).map((item, index) => (
            <div
              key={item.product || item._id || index}
              className="flex justify-between border-b py-2"
            >
              <span>{item.name}</span>
              <span>
                {item.qty} × ₦{item.price}
              </span>
            </div>
          ))}

          <div className="flex justify-between mt-3 font-bold text-lg">
            <span>Total:</span>
            <span>₦{order.totalPrice ?? order.totalAmount ?? 0}</span>
          </div>
        </div>
      </div>

      {/* DELIVERY DETAILS */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Delivery Information</h2>
        <div className="border rounded p-4">
          <p className="mb-1">
            <strong>Name:</strong> {order.shippingAddress?.fullName || "N/A"}
          </p>
          <p className="mb-1">
            <strong>Phone:</strong> {order.shippingAddress?.phone || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {order.shippingAddress?.address || "N/A"}
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="w-full py-4 bg-primary flex items-center justify-center text-white font-bold rounded-2xl hover:bg-primary/80 transition-all shadow-lg shadow-gray-900/20 mb-4"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
