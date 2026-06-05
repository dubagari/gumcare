import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AdminProducts from "./pages/Products";
import AdminOrders from "./pages/Orders";
import AddProduct from "./pages/AddProduct";
import AdminRegister from "./pages/AdminRegister";
import AdminLogin from "./pages/AdminLogin";
import Privateroute from "./common/Privateroute";
import Users from "./pages/Users";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/" element={<AdminRegister />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route element={<Privateroute requiredRole="admin" />}>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
