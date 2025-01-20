import axios from "axios";

// Log the API URL to verify its value during runtime
console.log(`Here: ${process.env.REACT_APP_API_URL}`);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
