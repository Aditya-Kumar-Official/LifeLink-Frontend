import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/endpoints.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "lifelink_token";
const USER_KEY = "lifelink_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch {
      return null;
    }
  });
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  const persist = (token, nextUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  // Re-check the stored token on load so a revoked session doesn't linger.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return setLoading(false);
    authApi
      .me()
      .then(({ user: fresh, donorProfile: donor }) => {
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
        setUser(fresh);
        setDonorProfile(donor);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const { token, user: next } = await authApi.login(credentials);
    persist(token, next);
    const { donorProfile: donor } = await authApi.me();
    setDonorProfile(donor);
    return next;
  }, []);

  const register = useCallback(async (body) => {
    const { token, user: next } = await authApi.register(body);
    persist(token, next);
    return next;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setDonorProfile(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const refreshDonorProfile = useCallback(async () => {
    const { donorProfile: donor } = await authApi.me();
    setDonorProfile(donor);
    return donor;
  }, []);

  const value = useMemo(
    () => ({
      user,
      donorProfile,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isDonor: user?.role === "donor",
      login,
      register,
      logout,
      updateUser,
      refreshDonorProfile,
    }),
    [user, donorProfile, loading, login, register, logout, updateUser, refreshDonorProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
