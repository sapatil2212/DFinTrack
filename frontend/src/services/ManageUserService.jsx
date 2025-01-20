import axios from "axios";

const base_url = `${import.meta.env.VITE_API_URL}/api/users/`;
const BASE_URL_ = `${import.meta.env.VITE_API_URL}/users/`;

const getAllUsers = async () => {
  return axios
    .get(`${base_url}all`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getCaretakers = async () => {
  return axios
    .get(`${base_url}users`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getAdmins = async () => {
  return axios
    .get(`${base_url}admins`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const addUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL_}caretaker`, userData);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${base_url}update/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const deleteUser = async (id) => {
  return axios
    .delete(`${base_url}delete/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export {
  getAllUsers,
  getCaretakers,
  getAdmins,
  addUser,
  updateUser,
  deleteUser,
};
