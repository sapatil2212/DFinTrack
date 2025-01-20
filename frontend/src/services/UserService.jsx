import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setJwt, removeJwt } from "../slices/JwtSlice";
import { logOut } from "../slices/UserSlices";

const base_url = `${import.meta.env.VITE_API_URL}/users/`;

// Inactivity timeout duration (10 seconds)
const INACTIVITY_TIMEOUT = 600000;
let inactivityTimer;

// Function to reset inactivity timer
const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
};

// Setup event listeners for user activity
const setupActivityTracking = () => {
  const events = [
    "mousedown",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
    "click",
  ];
  events.forEach((event) => {
    document.addEventListener(event, resetInactivityTimer);
  });
  resetInactivityTimer(); // Initial timer setup
};

const axiosInstance = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      // Start activity tracking if not already started
      resetInactivityTimer();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle refresh token logic and auto-logout
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${base_url}refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("jwtToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Updated logout handler
const handleLogout = () => {
  // Clear the inactivity timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  // Remove event listeners
  const events = [
    "mousedown",
    "mousemove",
    "keydown",
    "scroll",
    "touchstart",
    "click",
  ];
  events.forEach((event) => {
    document.removeEventListener(event, resetInactivityTimer);
  });

  // Clear local storage
  localStorage.clear(); // Clear all items in localStorage

  // Reset Redux state using dispatch
  const dispatch = useDispatch();
  dispatch(removeJwt());
  dispatch(logOut());

  // Redirect to login page
  window.location.href = "/login";
};

// Updated API calls to initialize activity tracking
const loginUser = async (login) => {
  try {
    const response = await axiosInstance.post("login", login);
    setupActivityTracking(); // Start activity tracking after successful login
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

const loginCaretaker = async (user) => {
  try {
    const response = await axiosInstance.post("caretaker", user);
    setupActivityTracking(); // Start activity tracking after successful login
    return response.data;
  } catch (error) {
    console.error("Error logging in caretaker:", error);
    throw error;
  }
};

const registerUser = async (user) => {
  try {
    const response = await axiosInstance.post("register", user);
    setupActivityTracking(); // Start activity tracking after successful registration
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Rest of the API calls remain unchanged
const checkEmailExists = async (email) => {
  try {
    const response = await axiosInstance.get("checkEmailExists", {
      params: { email },
    });
    return response.data.exists;
  } catch (error) {
    console.error("Error in checkEmailExists:", error);
    throw error;
  }
};

const validateSecurityKey = async (securityKey) => {
  try {
    const response = await axiosInstance.get("validateSecurityKey", {
      params: { securityKey },
    });
    return response.data;
  } catch (error) {
    console.error("Error validating security key:", error);
    throw error;
  }
};

const validateToken = async (token) => {
  try {
    const response = await axiosInstance.get("validateToken", {
      params: { token },
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

const refreshToken = async (refreshToken) => {
  try {
    const response = await axiosInstance.post("refresh", { refreshToken });
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export {
  registerUser,
  loginUser,
  loginCaretaker,
  checkEmailExists,
  validateSecurityKey,
  refreshToken,
  validateToken,
};
