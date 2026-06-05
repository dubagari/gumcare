import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  reset,
  signinStart,
  signinSuccess,
  signinFailure,
} from "../redux/authSlice";
import { Loader2, Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const { email, password } = formData;

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigatedRef = useRef(false);
  const alertShownRef = useRef(false);

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );
  console.log(user);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    if (isError && !alertShownRef.current) {
      alertShownRef.current = true;
      alert(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (user?.role === "admin" && !navigatedRef.current) {
      navigatedRef.current = true;
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    alertShownRef.current = false;
    try {
      dispatch(signinStart());
      const res = await fetch(`${API}/auth/loginadmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res) {
        dispatch(signinFailure(data.message || "Login failed"));
        return;
      }

      dispatch(signinSuccess(data));
    } catch (error) {
      dispatch(signinFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-[2rem] text-primary mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-gray-500 font-medium">
            Secure access to your dashboard
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium animate-in slide-in-from-top-4 duration-300">
            ✓ {successMessage}
          </div>
        )}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all duration-300 font-medium"
                placeholder="Admin Email"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all duration-300 font-medium"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 bg-primary text-white text-lg font-bold rounded-2xl hover:bg-primary/90 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:scale-100"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
        <div className="mt-8 text-center">
          <div className="pt-6 border-t border-gray-100">
            <a
              href="http://localhost:5173"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary font-bold transition-all duration-300"
            >
              <ArrowLeft size={16} />
              Back to Gumcare Shop
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
