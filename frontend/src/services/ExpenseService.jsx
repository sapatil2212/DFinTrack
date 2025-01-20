import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const ExpenseService = {
  createExpense: async (expense) => {
    const response = await apiClient.post("/expenses", expense);
    return response;
  },

  getExpenses: async () => {
    const response = await apiClient.get("/expenses");
    return response;
  },

  getAllExpenses: async () => {
    const response = await apiClient.get("/expenses/all");
    return response;
  },

  updateExpense: async (expenseId, expense) => {
    const response = await apiClient.put(`/expenses/${expenseId}`, expense);
    return response;
  },

  deleteExpense: async (expenseId) => {
    await apiClient.delete(`/expenses/${expenseId}`);
    return expenseId;
  },

  deleteAllExpenses: async () => {
    await apiClient.delete("/expenses");
  },

  getExpensesByProperty: async (propertyId) => {
    const response = await apiClient.get(`/expenses/${propertyId}`);
    return response;
  },
};

export default ExpenseService;
