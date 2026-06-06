const API_URL = import.meta.env.VITE_API_BASE_URL;

const signupuser = async (userData) => {
  const res = await fetch(`${API_URL}/api/auth/signupuser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

const login = async (userData) => {
  const res = await fetch(`${API_URL}/api/auth/loginuser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  signupuser,
  logout,
  login,
};

export default authService;
