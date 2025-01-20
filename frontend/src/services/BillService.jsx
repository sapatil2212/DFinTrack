import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/bills`;
export const billService = {
  createBill: async (billData) => {
    try {
      const response = await axios.post(`${API_URL}/generate`, billData, {
        params: { userId: billData.userId },
      });
      return response.data;
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.data?.error ===
          "Bill already generated for this booking"
      ) {
        const customError = new Error(
          "Bill already generated for this booking."
        );
        customError.response = error.response;
        throw customError;
      }
      throw error;
    }
  },

  getBillsByBookingId: async (bookingId) => {
    try {
      const response = await axios.get(`${API_URL}/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch existing bill details");
    }
  },
  exportBill: async (billId, format) => {
    const response = await axios.get(`${API_URL}/${billId}/export`, {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },
  updateBill: async (id, billData) => {
    const response = await axios.put(`${API_URL}/${id}`, billData);
    return response.data;
  },

  deleteBill: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  getBillById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getAllBills: async () => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  },

  /*
    getAllBills: async () => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  */

  getBillAndBookingDetails: async (billId) => {
    const response = await axios.get(`${API_URL}/${billId}/details`);
    return response.data;
  },
};
