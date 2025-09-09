// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const listingsAPI = {
  create: (data) =>
    api.post("/listings", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: (params) => api.get("/listings", { params }),
  getById: (id) => api.get(`/listings/${id}`),
  update: (id, data) =>
    api.put(`/listings/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/listings/${id}`),
  expressInterest: (id, data) => api.post(`/listings/${id}/interest`, data),
  assign: (id, data) => api.post(`/listings/${id}/assign`, data),
  complete: (id) => api.put(`/listings/${id}/complete`),
  getUserListings: (params) => api.get("/listings/user", { params }),
  getNearby: (lat, lng, radius) => // ✅ fixed
    api.get("/listings/nearby", {
      params: { lat, lng, radius },
    }),
};


export const chatAPI = {
  createOrGet: (data) => api.post("/chat", data),
  getUserChats: () => api.get("/chat"),
  getMessages: (chatId, params) => api.get(`/chat/${chatId}`, { params }),
  sendMessage: (chatId, data) => api.post(`/chat/${chatId}/messages`, data),
  markAsRead: (chatId) => api.put(`/chat/${chatId}/read`),
};

export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  rate: (id, data) => api.post(`/users/${id}/rate`, data),
  getRatings: (id, params) => api.get(`/users/${id}/ratings`, { params }),
  updateProfileImage: (data) =>
    api.put("/users/profile-image", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  search: (params) => api.get("/users/search", { params }),
};

export const uploadAPI = {
  // for generic file uploads if needed
  uploadFile: (endpoint, data) =>
    api.post(endpoint, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // convenience wrappers
  listing: (data) => listingsAPI.create(data),
  profileImage: (data) => usersAPI.updateProfileImage(data),
};

export default api;
