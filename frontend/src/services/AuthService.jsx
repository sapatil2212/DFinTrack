import axios from "axios";

const base_url = `${import.meta.env.VITE_API_URL}/users/`;

const loginUser = async (login) => {
  try {
    const response = await axios.post(`${base_url}login`, login);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export { loginUser };
