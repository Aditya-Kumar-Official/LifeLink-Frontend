import api from "./client.js";

export const authApi = {
  register: (body) => api.post("/auth/register", body).then((r) => r.data),
  login: (body) => api.post("/auth/login", body).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  changePassword: (body) => api.put("/auth/change-password", body).then((r) => r.data),
};

export const userApi = {
  publicStats: () => api.get("/users/stats").then((r) => r.data),
  dashboard: () => api.get("/users/dashboard").then((r) => r.data),
  updateProfile: (body) => api.put("/users/profile", body).then((r) => r.data),
  uploadImage: (file) => {
    const form = new FormData();
    form.append("image", file);
    return api.post("/users/profile/image", form, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
  },
};

export const donorApi = {
  search: (params) => api.get("/donors", { params }).then((r) => r.data),
  byId: (id) => api.get(`/donors/${id}`).then((r) => r.data),
  mine: () => api.get("/donors/me").then((r) => r.data),
  register: (body) => api.post("/donors/register", body).then((r) => r.data),
  setAvailability: (body) => api.patch("/donors/availability", body).then((r) => r.data),
};

export const requestApi = {
  create: (body) => api.post("/requests", body).then((r) => r.data),
  mine: (params) => api.get("/requests/my", { params }).then((r) => r.data),
  feed: () => api.get("/requests/feed").then((r) => r.data),
  all: (params) => api.get("/requests", { params }).then((r) => r.data),
  byId: (id) => api.get(`/requests/${id}`).then((r) => r.data),
  matches: (id) => api.get(`/requests/${id}/matches`).then((r) => r.data),
  respond: (id, body) => api.post(`/requests/${id}/respond`, body).then((r) => r.data),
  setStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }).then((r) => r.data),
  remove: (id) => api.delete(`/requests/${id}`).then((r) => r.data),
};

export const hospitalApi = {
  search: (params) => api.get("/hospitals", { params }).then((r) => r.data),
  cities: () => api.get("/hospitals/cities").then((r) => r.data),
  byId: (id) => api.get(`/hospitals/${id}`).then((r) => r.data),
  create: (body) => api.post("/hospitals", body).then((r) => r.data),
  update: (id, body) => api.put(`/hospitals/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/hospitals/${id}`).then((r) => r.data),
};

export const contactApi = {
  list: () => api.get("/contacts").then((r) => r.data),
  create: (body) => api.post("/contacts", body).then((r) => r.data),
  update: (id, body) => api.put(`/contacts/${id}`, body).then((r) => r.data),
  remove: (id) => api.delete(`/contacts/${id}`).then((r) => r.data),
};

export const notificationApi = {
  list: (params) => api.get("/notifications", { params }).then((r) => r.data),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch("/notifications/read-all").then((r) => r.data),
  remove: (id) => api.delete(`/notifications/${id}`).then((r) => r.data),
};

export const adminApi = {
  analytics: () => api.get("/admin/analytics").then((r) => r.data),
  users: (params) => api.get("/admin/users", { params }).then((r) => r.data),
  setRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
  removeUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
  donors: (params) => api.get("/admin/donors", { params }).then((r) => r.data),
  verifyDonor: (id, verified) => api.patch(`/admin/donors/${id}/verify`, { verified }).then((r) => r.data),
  removeDonor: (id) => api.delete(`/admin/donors/${id}`).then((r) => r.data),
};
