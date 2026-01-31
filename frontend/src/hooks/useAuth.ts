import { useCallback, useState } from "react";
import { User } from "../types";
import { API_BASE } from "../utils/api";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (
    employeeId: string,
    password: string,
    isAdminLogin?: boolean,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const adminEmployeeId = import.meta.env.VITE_ADMIN_EMPLOYEE_ID || "BAYN00008";

  const login = useCallback(
    async (
      employeeId: string,
      password: string,
      isAdminLogin: boolean = false,
    ) => {
      setLoading(true);
      setError(null);

      const loginEmployeeId = isAdminLogin ? adminEmployeeId : employeeId;

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_id: loginEmployeeId, password }),
        });
        const raw = await res.text();
        let payload: Record<string, any> | null = null;

        if (raw.trim().length > 0) {
          try {
            payload = JSON.parse(raw);
          } catch {
            payload = null;
          }
        }

        if (!res.ok) {
          const detail =
            payload?.detail ||
            payload?.message ||
            (raw.trim().length > 0
              ? raw.trim()
              : `Login failed (${res.status})`);
          throw new Error(detail);
        }

        if (!payload) {
          throw new Error("Login failed (empty response)");
        }

        const data = payload;
        const loggedInUser: User = {
          id: data.id,
          employee_id: data.employee_id,
          name: data.name,
          role: data.role,
          token: data.access_token,
        };

        setUser(loggedInUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
  };
}
