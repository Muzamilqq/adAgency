import { useState, useEffect, useCallback } from "react";
import type { User, AuthState } from "@/types";
import axios from "axios";
const API_URL = "https://adagency-backend-production.up.railway.app";
axios.defaults.baseURL = API_URL;

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("authToken") || null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthState({
          user: res.data.data.user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem("authToken");
        setAuthState({ user: null, token: null, isAuthenticated: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/auth/login", { email, password });
        const token = res.data.data.token;
        localStorage.setItem("authToken", token);

        setAuthState({
          user: res.data.data.user,
          token,
          isAuthenticated: true,
        });
        return true;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setAuthState({ user: null, token: null, isAuthenticated: false });
  }, []);

  // Update profile
  const updateProfile = useCallback(
    async (data: { name: string; email: string }) => {
      if (!authState.token) throw new Error("Not authenticated");
      const res = await axios.put("/api/auth/profile", data, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setAuthState((prev) => ({ ...prev, user: res.data.data.user }));
      return res.data;
    },
    [authState.token],
  );

  // Change password
  const updatePassword = useCallback(
    async (data: { currentPassword: string; newPassword: string }) => {
      if (!authState.token) throw new Error("Not authenticated");
      const res = await axios.post("/api/auth/change-password", data, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      return res.data;
    },
    [authState.token],
  );

  // Register
  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: string = "viewer",
    ): Promise<boolean> => {
      setIsLoading(true);
      try {
        await axios.post("/api/auth/register", { email, password, name, role });
        return true;
      } catch (error) {
        console.error("Register error:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    ...authState,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    updatePassword,
  };
}
