
import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wardwatch_user")) || null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("wardwatch_token", token);
    localStorage.setItem("wardwatch_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const register = async (formData) => {
    const response = await api.post("/auth/register", formData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("wardwatch_token");
    localStorage.removeItem("wardwatch_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
