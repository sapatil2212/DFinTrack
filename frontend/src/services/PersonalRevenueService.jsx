import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/personal-revenues`,
});

const getToken = () => localStorage.getItem("token");

const getTokenData = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const adminId = decoded.id;

    if (!adminId) {
      console.error("Admin ID is missing from the token.");
      throw new Error("Admin ID is missing in the token.");
    }
    return {
      adminId,
      accountType: decoded.accountType || null,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const revenueService = {
  createRevenue: async ({ data, token }) => {
    try {
      const tokenData = getTokenData();
      const adminId = tokenData?.adminId;

      if (!adminId) throw new Error("Admin ID is missing in the token.");

      const response = await api.post(`/create?adminId=${adminId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message || "Failed to create revenue";
    }
  },
  getRevenueById: async (id) => {
    try {
      const tokenData = getTokenData();
      const adminId = tokenData?.adminId;

      if (!adminId) throw new Error("Admin ID is missing in the token.");

      const response = await api.get(`/${id}?adminId=${adminId}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching revenue with ID ${id}:`, error);
      throw error.response?.data || "Failed to fetch revenue details.";
    }
  },

  getAllRevenues: async () => {
    try {
      const tokenData = getTokenData();
      const adminId = tokenData?.adminId;

      if (!adminId) throw new Error("Admin ID is missing in the token.");

      const response = await api.get("/all", { params: { adminId } });

      return response.data;
    } catch (error) {
      console.error("Error fetching all revenues:", error);
      throw error.response?.data || "Failed to fetch revenues.";
    }
  },
  updateRevenue: async (id, data) => {
    try {
      const tokenData = getTokenData();
      const adminId = tokenData?.adminId;

      if (!adminId) throw new Error("Admin ID is missing in the token.");

      const response = await api.put(`/${id}?adminId=${adminId}`, data);

      return {
        data: {
          id,
          ...data,
          ...response.data,
        },
      };
    } catch (error) {
      console.error(`Error updating revenue with ID ${id}:`, error);
      throw error.response?.data || "Failed to update revenue.";
    }
  },
  deleteRevenue: async (id) => {
    try {
      const tokenData = getTokenData();
      const adminId = tokenData?.adminId;

      if (!adminId) throw new Error("Admin ID is missing in the token.");

      // Pass adminId as a query parameter
      const response = await api.delete(`/${id}?adminId=${adminId}`);

      return response.data;
    } catch (error) {
      console.error(`Error deleting revenue with ID ${id}:`, error);
      throw error.response?.data || "Failed to delete revenue.";
    }
  },
};
