import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = `${import.meta.env.VITE_API_URL}/api/bookings`;

const getToken = () => {
  return localStorage.getItem("token");
};
const getTokenData = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = jwtDecode(token);
  return {
    userId: decoded.id,
    propertyId: decoded.propertyId,
    accountType: decoded.accountType,
  };
};
export const bookingService = {
  createBooking: async (bookingData) => {
    const tokenData = getTokenData();
    if (!tokenData?.userId) throw new Error("User ID not found in token");

    const enrichedBookingData = {
      ...bookingData,
      userId: tokenData.userId,
      // Only use token's propertyId for non-admin users
      propertyId:
        tokenData.accountType === "ADMIN"
          ? bookingData.propertyId
          : tokenData.propertyId,
      bookingDateTime: new Date().toISOString(),
    };

    // Validate propertyId presence
    if (!enrichedBookingData.propertyId) {
      throw new Error("Property ID is required");
    }

    const token = getToken();
    const response = await axios.post(API_URL, enrichedBookingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  updateBooking: async (id, bookingData) => {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${id}`, bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteBooking: async (id) => {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getBookingById: async (id) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getAllBookings: async () => {
    const token = getToken();
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getBookingsByPropertyId: async (propertyId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/property/${propertyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getBookingsByUserId: async (userId) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  checkoutBooking: async (id) => {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/${id}/checkout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/${id}/status?status=${status}`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};
