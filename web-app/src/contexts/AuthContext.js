import jwt_decode from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import toast from 'react-hot-toast'
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    const decodedToken = jwt_decode(token);
    setUser(decodedToken);
  };

  const logout = () => {
    console.log("logout is called");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCart([]);
    localStorage.removeItem("cart");
    
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isAuthenticated = () => {
    return token !== null && token !== undefined;
  };

  const isAdmin = () => {
    return isAuthenticated() && user?.role === "ROLE_ADMIN";
  };

  const isStaff = () => {
    return isAuthenticated() && user?.role === "ROLE_STAFF";
  };

  const getStaff = async (userId, role) => {
    try {
      const response = await api.get(
        role === "ROLE_STAFF" ? `/staff/${userId}` : `/admin/${userId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      if (isAuthenticated()) {
        setIsLoading(true);
        const decodedToken = jwt_decode(token || localStorage.getItem("token"));
        const user = await getStaff(decodedToken?.user_id, decodedToken?.role);
        setUser(user);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    onLoad();
    // eslint-disable-next-line
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
