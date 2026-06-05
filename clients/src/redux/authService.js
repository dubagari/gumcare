const API_URL = "/api/auth";

// Register user
// const signupuser = async (userData) => {
//   const response = await fetch(`${API_URL}/signupuser`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Registration failed');
//   }

//   if (data) {
//     localStorage.setItem('user', JSON.stringify(data));
//   }

//   return data;
// };

// // Login user
// const login = async (userData) => {
//   const response = await fetch(`${API_URL}/loginuser`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Login failed');
//   }

//   if (data) {
//     localStorage.setItem('user', JSON.stringify(data));
//   }

//   return data;
// };

// authService.js

const signupuser = async (userData) => {
  const res = await fetch(`${API_URL}/signupuser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data; // MUST return full object
};

const login = async (userData) => {
  const res = await fetch(`${API_URL}/loginuser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data; // MUST return full object
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
