import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getProfile = async () => {
  try {
    const { data } = await axiosInstance.get("/profile");
    return data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};

export const updateUsername = async (username) => {
  try {
    const { data } = await axiosInstance.put("/profile/update/username", {
      username,
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};

export const updatePassword = async (oldPassword, newPassword) => {
  try {
    const { data } = await axiosInstance.put("/profile/update/password", {
      oldPassword,
      newPassword,
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data || error.message);
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
