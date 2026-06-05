import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { fetchDashboardStats } from "../redux/adminSlice";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, trend, isPositive, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}
    >
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span
            className={`flex items-center text-sm font-medium mb-1 ${isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {isPositive ? (
              <TrendingUp size={14} className="mr-1" />
            ) : (
              <TrendingDown size={14} className="mr-1" />
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="mb-8 bg-gradient-to-r from-primary to-primary/70 rounded-3xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-1">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-white/80">
          Here's what's happening in your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={
            loading ? "..." : `$${stats?.totalRevenue?.toLocaleString() || 0}`
          }
          icon={DollarSign}
          trend="+12.5%"
          isPositive={true}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Active Users"
          value={loading ? "..." : stats?.activeUsers || 0}
          icon={Users}
          trend="+5.2%"
          isPositive={true}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : stats?.totalOrders || 0}
          icon={ShoppingBag}
          trend="-2.4%"
          isPositive={false}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="Products"
          value={loading ? "..." : stats?.totalProducts || 0}
          icon={Package}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/dashboard/products"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
            <Package size={22} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Manage Products</h3>
          <p className="text-sm text-gray-500">
            Add, edit or remove products from your catalog
          </p>
        </Link>
        <Link
          to="/dashboard/orders"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
            <ShoppingBag size={22} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">View Orders</h3>
          <p className="text-sm text-gray-500">
            Track and manage customer orders
          </p>
        </Link>
        <Link
          to="/dashboard/users"
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-primary hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
            <Users size={22} />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Manage Users</h3>
          <p className="text-sm text-gray-500">
            View and manage your customer base
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
