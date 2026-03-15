import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token"); 
    
    // 1. Set global header if token exists
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
    }

    // 2. Safely parse the user data
    if (storedUser && storedUser !== "undefined" && storedUser !== "null" && storedUser !== "{}") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from local storage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      localStorage.removeItem("user");
    }
    
    setLoading(false);
  }, []);

  const login = (data) => {
    // 1. Extract token (kabhi token object ke andar hota hai, kabhi alag se)
    const token = data.token || "";
    
    // 2. 🔥 THE ULTIMATE FIX: Safely extract user data
    // Agar 'data.user' hai toh use lo, warna maan lo ki poora 'data' hi user hai.
    let userData = data.user ? data.user : data;

    // Agar backend ne galti se '_id' ki jagah sirf 'id' bheja hai, toh use fix karo
    if (userData.id && !userData._id) {
        userData._id = userData.id;
    }

    // 3. Set the state and local storage
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common['Authorization'];
    navigate("/");
  };

   const isAuthenticated = !!user && Object.keys(user).length > 0;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};