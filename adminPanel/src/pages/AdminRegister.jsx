import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  signinStart,
  signinSuccess,
  signinFailure,
  reset,
  logout,
} from "../redux/authSlice";
import { Loader2, Mail, Lock, User, Key } from "lucide-react";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    secretKey: "",
  });

  const { name, email, password, secretKey } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, user: currentUser } = useSelector((state) => state.auth);
  const token = currentUser?.token;
  const API = import.meta.env.VITE_API_BASE_URL;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signinStart());
      const res = await fetch(`${API}/api/admin/signupadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(signinFailure(data.message || "Admin Registration failed"));
        return;
      }

      // Clear auth state and redirect to login
      dispatch(logout());
      dispatch(reset());
      navigate("/login", {
        state: { message: "Account created successfully! Please login." },
      });
    } catch (error) {
      dispatch(signinFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-primary/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-primary/10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary mb-4">
            <Key size={32} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-gray-500 font-medium">
            Create administrative access
          </p>
        </div>
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all duration-300 font-medium"
                placeholder="Admin Name"
              />
            </div>
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
                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all duration-300 font-medium"
                placeholder="Email Address"
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
                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all duration-300 font-medium"
                placeholder="Password"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Key size={20} />
              </div>
              <input
                type="password"
                name="secretKey"
                value={secretKey}
                onChange={onChange}
                required
                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-red-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:bg-white focus:border-red-500 transition-all duration-300 font-medium"
                placeholder="Admin Secret Key"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center mb-2 py-4 px-4 bg-gray-900 text-white text-lg font-bold rounded-2xl hover:bg-black focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 shadow-xl disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                "Create Admin Account"
              )}
            </button>
            <Link
              to={"/login"}
              className="group relative w-full flex justify-center mt-2 py-4 px-4 bg-accent text-white text-lg font-bold rounded-2xl hover:bg-[#b14310] focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 shadow-xl disabled:opacity-70"
            >
              Login Admin Account
            </Link>
          </div>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-500 font-medium">
            Standard user?{" "}
            <a
              href="http://localhost:5173/register"
              className="text-primary font-bold hover:underline ml-1"
            >
              User Signup
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
