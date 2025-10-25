// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
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
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        sessionStorage.setItem("redirectAfterLogin", currentPath);
        window.location.href = "/login";
      }
    }
    if (!error.response) {
      console.error("Network error:", error.message);
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
      timeout: 60000,
    }),
  getAll: (params) => api.get("/listings", { params }),
  getById: (id) => api.get(`/listings/${id}`),
  update: (id, data) =>
    api.put(`/listings/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }),
  delete: (id) => api.delete(`/listings/${id}`),
  expressInterest: (id, data) => api.post(`/listings/${id}/interest`, data),
  assign: (id, data) => api.post(`/listings/${id}/assign`, data),
  complete: (id) => api.put(`/listings/${id}/complete`),
  getUserListings: (params) => api.get("/listings/user", { params }),
  getNearby: (lat, lng, radius) =>
    api.get("/listings/nearby", {
      params: { lat, lng, radius },
    }),
  search: (params) => api.get("/listings/search", { params }),
};

export const chatAPI = {
  getUserChats: () => api.get("/chat"),
  getMessages: (chatId) => api.get(`/chat/${chatId}/messages`),
  sendMessage: (chatId, data) => api.post(`/chat/${chatId}/messages`, data),
  createOrGet: (data) => api.post("/chat/create-or-get", data),
  getChat: (chatId) => api.get(`/chat/${chatId}`),
};

export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  // ✅ ADDED: updateProfile method
  updateProfile: (data) => api.put("/users/profile", data),
  rate: (id, data) => api.post(`/users/${id}/rate`, data),
  getRatings: (id, params) => api.get(`/users/${id}/ratings`, { params }),
  updateProfileImage: (data) =>
    api.put("/users/profile-image", data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }),
  search: (params) => api.get("/users/search", { params }),
};

export const uploadAPI = {
  uploadFile: (endpoint, data, onProgress) =>
    api.post(endpoint, data, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }),

  uploadMultiple: (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("images", file);
    });
    return api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  uploadImage: (file, onProgress) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  listing: (data, onProgress) => listingsAPI.create(data),
  profileImage: (data, onProgress) => usersAPI.updateProfileImage(data),
};

export default api;
