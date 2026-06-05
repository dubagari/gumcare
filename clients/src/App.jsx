import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import HomeHero from "./pages/HomeHero";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cartpage from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentLoading from "./pages/PaymentLoading";
import OrderSuccess from "./pages/OrderSuccess";
import Order from "./pages/Order";
import Wishlist from "./pages/Wishlist";

// Layout for customer-facing pages (includes Header)
const MainLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeHero />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/payment-loading" element={<PaymentLoading />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order" element={<Order />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
