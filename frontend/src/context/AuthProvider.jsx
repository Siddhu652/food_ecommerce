import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || null);

  useEffect(() => {
    setToken(Cookies.get("token"));
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
