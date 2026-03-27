import React, { createContext, useEffect, useState, ReactNode } from "react";
import * as authService from "../services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  user: any | null;
  userRegister: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<any>;
  checkVerification: (email: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<void>;
  loading: boolean;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [userRegister, setUserRegister] = useState<any | null>(null); 
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
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const register = async (data: any) => {
    const registeredUser = await authService.register(data);
    setUserRegister(registeredUser);
    return registeredUser;
  };
  const checkVerification = async (email: string) => {
    return authService.checkVerification(email);
  };

  const resendVerification = async (email: string) => {
    await authService.resendVerification(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRegister,
        login,
        logout,
        register,
        checkVerification,
        resendVerification,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
