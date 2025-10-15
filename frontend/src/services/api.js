// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds (better for file uploads)
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
    // Handle 401 Unauthorized - but avoid infinite loops
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Only redirect if not already on auth pages
      if (currentPath !== "/login" && currentPath !== "/register") {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];

        // Store the attempted URL for redirect after login
        sessionStorage.setItem("redirectAfterLogin", currentPath);

        window.location.href = "/login";
      }
    }

    // Handle network errors
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
      timeout: 60000, // 60s for large uploads
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
      timeout: 60000,
    }),
  search: (params) => api.get("/users/search", { params }),
};

// Add to uploadAPI
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

  // Add these methods:
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
