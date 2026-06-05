import React, { useEffect, useState } from "react";
import { Search, Filter, Eye, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../redux/orderSlice";

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Processing":
      return "bg-blue-100 text-blue-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Shipped":
      return "bg-purple-100 text-purple-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentColor = (isPaid) => {
  return isPaid ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50";
};

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrders());
    }
  }, [status, dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      (order.user &&
        order.user.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage customer orders.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors flex-1 sm:flex-none justify-center">
              <Filter size={16} />
              Status
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors flex-1 sm:flex-none justify-center">
              <Filter size={16} />
              Date
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Paid</th>
                <th className="p-4 font-medium">Method</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {status === "loading" ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400">
                    <Loader2
                      size={32}
                      className="animate-spin mx-auto mb-2 text-primary"
                    />
                    Loading orders...
                  </td>
                </tr>
              ) : status === "failed" ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-bold text-gray-900">
                        #{order._id.substring(18, 24)}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {order.user?.name || "Unknown User"}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold ${getPaymentColor(order.isPaid)}`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700 font-medium">
                      {order.paymentMethod || "N/A"}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer outline-none border-none ${getStatusColor(order.status || "Pending")}`}
                      >
                        <option
                          value="Pending"
                          className="bg-white text-gray-900"
                        >
                          Pending
                        </option>
                        <option
                          value="Processing"
                          className="bg-white text-gray-900"
                        >
                          Processing
                        </option>
                        <option
                          value="Shipped"
                          className="bg-white text-gray-900"
                        >
                          Shipped
                        </option>
                        <option
                          value="Delivered"
                          className="bg-white text-gray-900"
                        >
                          Delivered
                        </option>
                        <option
                          value="Cancelled"
                          className="bg-white text-gray-900"
                        >
                          Cancelled
                        </option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-white">
          <span>Showing {filteredOrders.length} orders</span>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
