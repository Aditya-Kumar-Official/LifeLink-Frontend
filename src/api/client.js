import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ""}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lifelink_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    // An expired or revoked token should drop the session everywhere at once.
    if (status === 401 && localStorage.getItem("lifelink_token")) {
      localStorage.removeItem("lifelink_token");
      localStorage.removeItem("lifelink_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?expired=1";
      }
    }
    return Promise.reject({
      status,
      message: data?.message || error.message || "Could not reach the LifeLink server",
      errors: data?.errors || null,
    });
  }
);

export default api;
