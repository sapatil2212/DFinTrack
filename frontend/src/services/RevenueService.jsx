import axios from "axios";
import { jwtDecode } from "jwt-decode";

// API base configuration
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/property-revenues`,
});

const getToken = () => localStorage.getItem("token");

const getTokenData = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      userId: decoded.id || null,
      propertyId: decoded.propertyId || null,
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
      if (!token) throw new Error("Authentication token is required");

      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const propertyId = decoded.propertyId;

      if (!userId || !propertyId) {
        throw new Error("Invalid token data");
      }

      const revenueData = {
        ...data,
        propertyId: parseInt(propertyId),
      };

      const response = await api.post("/create", revenueData, {
        token,
        params: { userId },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message || "Failed to create revenue";
    }
  },

  getRevenueById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching revenue with ID ${id}:`, error);
      throw error.response?.data || "Failed to fetch revenue details.";
    }
  },

  getAllRevenuesByPropertyId: async (propertyId) => {
    try {
      const tokenData = getTokenData();
      const userId = tokenData?.userId;
      const accountType = tokenData?.accountType;

      if (!propertyId) throw new Error("Property ID is missing.");

      if (accountType === "USER" && userId && propertyId) {
        const response = await api.get(`/property/${propertyId}`, {
          params: { userId: Number(userId) },
        });

        return response.data;
      }

      const response = await api.get(
        `/property-revenues/property/${propertyId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching revenues for property ${propertyId}:`,
        error
      );
      throw error.response?.data || "Failed to fetch property revenues.";
    }
  },

  getAllRevenues: async () => {
    try {
      const tokenData = getTokenData();
      const userId = tokenData?.userId;

      if (!userId) throw new Error("User ID is missing in the token.");

      console.log("Token Data:", tokenData);

      const response = await api.get("/all", { params: { userId } });
      console.log("API Response:", response.data);

      return response.data.data;
    } catch (error) {
      console.error("Error fetching all revenues:", error);
      throw error.response?.data || "Failed to fetch revenues.";
    }
  },

  updateRevenue: async (id, data) => {
    try {
      const tokenData = getTokenData();
      const userId = tokenData?.userId;

      if (!userId) throw new Error("User ID is missing in the token.");

      console.log("Token Data:", tokenData);

      const response = await api.put(`/${id}`, data, { params: { userId } });
      console.log("API Response:", response.data);

      return response.data;
    } catch (error) {
      console.error(`Error updating revenue with ID ${id}:`, error);
      throw error.response?.data || "Failed to update revenue.";
    }
  },

  deleteRevenue: async (id) => {
    try {
      const tokenData = getTokenData();
      const userId = tokenData?.userId;

      if (!userId) throw new Error("User ID is missing in the token.");

      const response = await api.delete(`/${id}`, {
        params: { userId },
      });

      return response.data;
    } catch (error) {
      console.error(`Error deleting revenue with ID ${id}:`, error);
      throw error.response?.data || "Failed to delete revenue.";
    }
  },

  getRevenuesGroupedByProperty: async () => {
    try {
      const response = await api.get("/grouped");
      return response.data;
    } catch (error) {
      console.error("Error fetching grouped revenues:", error);
      throw error.response?.data || "Failed to fetch grouped revenues.";
    }
  },
};
