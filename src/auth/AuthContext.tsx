import { createContext } from "react";
import type { User } from "./types";

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);




