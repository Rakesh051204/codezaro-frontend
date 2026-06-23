import axios from "axios";

const API_BASE_URL = "https://codezaro-backend-7.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
};

export const register = async (email, password, fullName) => {
  const response = await api.post("/auth/register", {
    email,
    password,
    full_name: fullName,
  });
  return response.data;
};

export const submitReview = async (code, language) => {
  const response = await api.post("/review/", { code, language });
  return response.data;
};

export const getUsage = async () => {
  const response = await api.get("/review/usage");
  return response.data;
};

export const getHistory = async (limit = 10, offset = 0) => {
  const response = await api.get(`/review/history?limit=${limit}&offset=${offset}`);
  return response.data;
};

export default api;