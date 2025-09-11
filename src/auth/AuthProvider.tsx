import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { loginRequest, logoutRequest, meRequest } from "./authService";
import { TOKEN_KEY } from "./api";
import type { User } from "./types";

const STORAGE_KEY = "app:userSnapshot";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // učitaj snapshot iz localStorage pri mountu
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // potvrdi sesiju sa backendom ako token postoji
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const me = await meRequest();
        if (me) {
          setUser(me);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(me));
        } else {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (err) {
        console.warn("meRequest failed:", err);
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // LOGIN
  async function loginWithCredentials(email: string, password: string) {
    setLoading(true);
    try {
      const response = await loginRequest(email, password);

      setUser(response.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(response.user));
      localStorage.setItem(TOKEN_KEY, response.token);

      if (response.redirect_to) {
        navigate(response.redirect_to, { replace: true });
      }
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // REFRESH
  async function refreshUser() {
    try {
      const me = await meRequest();
      if (me) {
        setUser(me);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(me));
      } else {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  // LOGOUT
  async function logout() {
    try {
      await logoutRequest();
    } catch {}
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    navigate("/login", { replace: true });
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      loginWithCredentials,
      refreshUser,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}








