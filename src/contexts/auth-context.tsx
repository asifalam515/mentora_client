"use client";
import { createContext, ReactNode, useContext } from "react";
interface AuthContextType {
  session: any; // Replace with your actual session type
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = null; // Replace with actual session fetching logic
  return (
    <AuthContext.Provider value={{ session, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
