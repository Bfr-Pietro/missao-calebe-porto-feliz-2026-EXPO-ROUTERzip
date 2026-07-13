import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthUser } from "../types";
import { authService } from "../services/authService";
import { ADMIN_EMAIL } from "../constants";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getPersistedUser().then((persisted) => {
      setUser(persisted);
      setIsLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    const signedInUser = await authService.signIn(email, password);
    setUser(signedInUser);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAdmin: user?.email.toLowerCase() === ADMIN_EMAIL,
      signIn,
      signOut,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
