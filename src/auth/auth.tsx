import React, { useEffect, useState } from "react";
import { User } from "../api/types";

export interface AuthContext {
  authUser: User | null;
  isLogedIn: boolean;
  setAuthUser: (user: User | null) => void;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const token = localStorage.getItem("access_token");
  const isLogedIn = !!token;

  useEffect(() => {
    if (token) {
      console.log("token ada cuy");
    } else {
      console.log("gada token cuy");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, isLogedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
