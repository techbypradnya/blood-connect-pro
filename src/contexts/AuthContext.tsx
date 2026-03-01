import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AuthUser } from "@/services/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("bloodconnect_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem("bloodconnect_user");
      }
    }
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem("bloodconnect_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bloodconnect_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
