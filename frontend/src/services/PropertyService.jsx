import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/properties`;

const getAllProperties = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getPropertyById = async (id) => {
  const response = await axios.get(`${API_URL}${id}`);
  return response.data;
};

export const propertyService = {
  getAllProperties,
  getPropertyById,
};
