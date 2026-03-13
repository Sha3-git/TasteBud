import React, { createContext, useEffect, useState, ReactNode } from "react";
import * as authService from "../services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<any>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await authService.getStoredUser();
      if (stored) setUser(stored);
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setUser(user);
    console.log("User logged in:", user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (data: any) => {
    return authService.register(data);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};