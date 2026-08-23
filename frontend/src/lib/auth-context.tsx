"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, setAccessToken } from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  registerInstitute: (payload: {
    instituteName: string;
    instituteCode: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    website?: string;
    address?: string;
  }) => Promise<{ message: string; instituteId: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const me = await api.get<User>("/users/me");
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const token = await api.refresh();
      if (token) {
        setAccessToken(token);
        await refreshUser();
      }
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.post<{ user: User; accessToken: string }>(
      "/auth/login",
      { email, password },
      { skipAuth: true },
    );
    setAccessToken(result.accessToken);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await api.post<{ user: User; accessToken: string }>(
        "/auth/register",
        { name, email, password },
        { skipAuth: true },
      );
      setAccessToken(result.accessToken);
      setUser(result.user);
      return result.user;
    },
    [],
  );

  const registerInstitute = useCallback(
    async (payload: {
      instituteName: string;
      instituteCode: string;
      name: string;
      email: string;
      password: string;
      phone?: string;
      website?: string;
      address?: string;
    }) => {
      return api.post<{ message: string; instituteId: string }>(
        "/auth/register-institute",
        payload,
        { skipAuth: true },
      );
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, registerInstitute, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
