import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaKey,
  FaEnvelope,
  FaLock,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  loginUser,
  refreshToken,
  validateToken,
} from "../services/UserService";
import { useDispatch } from "react-redux";
import { setJwt } from "../slices/JwtSlice";
import { setUser } from "../slices/UserSlices";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    securityKey: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    securityKey: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";
      const storedToken = localStorage.getItem("jwtToken");

      if (isAuthenticated && storedToken) {
        try {
          const isValid = await validateToken(storedToken);
          if (isValid) {
            navigate("/dashboard2", { replace: true });
          } else {
            await handleTokenRefresh();
          }
        } catch (error) {
          console.error("Error validating token:", error);
          handleLogout();
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleTokenRefresh = async () => {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    if (refreshTokenValue) {
      try {
        const { accessToken, refreshToken: newRefreshToken } =
          await refreshToken(refreshTokenValue);
        dispatch(setJwt(accessToken));
        localStorage.setItem("jwtToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        navigate("/dashboard2", { replace: true });
      } catch (error) {
        console.error("Failed to refresh token:", error);
        handleLogout();
      }
    } else {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    dispatch(setJwt(null));
    dispatch(setUser(null));
    navigate("/login", { replace: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      email: "",
      password: "",
      securityKey: "",
      general: "",
    });

    try {
      const res = await loginUser(formData);

      if (res && res.jwtToken && res.refreshToken) {
        dispatch(setJwt(res.jwtToken));
        localStorage.setItem("jwtToken", res.jwtToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("isAuthenticated", "true");

        try {
          const decoded = jwtDecode(res.jwtToken);
          dispatch(
            setUser({
              ...decoded,
              email: decoded.sub,
            })
          );
          localStorage.setItem("user", JSON.stringify(decoded));
          navigate("/dashboard2", { replace: true });
        } catch (decodeError) {
          console.error("Invalid token:", decodeError.message);
          setError((prevError) => ({
            ...prevError,
            general: "Failed to process login response.",
          }));
        }
      } else {
        setError((prevError) => ({
          ...prevError,
          general: "Invalid response from server.",
        }));
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message;
      switch (error.response.status) {
        case 404:
          setError((prevError) => ({
            ...prevError,
            email: errorMessage || "User not found",
          }));
          break;
        case 400:
          if (errorMessage.includes("email")) {
            setError((prevError) => ({ ...prevError, email: errorMessage }));
          } else if (errorMessage.includes("password")) {
            setError((prevError) => ({ ...prevError, password: errorMessage }));
          } else {
            setError((prevError) => ({ ...prevError, general: errorMessage }));
          }
          break;
        case 403:
          setError((prevError) => ({
            ...prevError,
            securityKey: errorMessage || "Invalid Security Key",
          }));
          break;
        case 500:
          setError((prevError) => ({
            ...prevError,
            general: "An unexpected error occurred. Please try again.",
          }));
          break;
        default:
          setError((prevError) => ({
            ...prevError,
            general: errorMessage || "Login failed",
          }));
      }
    } else {
      setError((prevError) => ({
        ...prevError,
        general: "Unable to connect to the server. Please try again.",
      }));
    }
  };

  const renderInput = (
    name,
    label,
    icon,
    type = "text",
    showToggle = false
  ) => {
    const IconComponent = icon;
    return (
      <div className="mb-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconComponent className="text-gray-400" />
          </div>
          <input
            type={
              showToggle && name === "password" && showPassword ? "text" : type
            }
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={`Enter your ${label.toLowerCase()}`}
            className={`pl-10 pr-10 block w-full border rounded-md py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
              ${error[name] ? "border-red-500" : "border-gray-300"}`}
          />
          {name === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
        {error[name] && (
          <p className="text-red-500 text-xs mt-1">{error[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="grid place-items-center min-h-screen bg-gradient-to-r bg-gray-50 font-['Poppins'] p-2">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-6 sm:p-8  mt-20">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {renderInput("email", "Email", FaEnvelope, "email")}
          {renderInput("password", "Password", FaLock, "password", true)}
          {renderInput("securityKey", "Security Key", FaKey, "text")}

          {error.general && (
            <div
              className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded relative text-sm"
              role="alert"
            >
              <span className="block sm:inline">{error.general}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 sm:py-3 px-4 bg-blue-600 text-white rounded-md flex items-center justify-center transition text-sm
              ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              } 
              transform hover:scale-[1.01] active:scale-[0.99]`}
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Sign In"}
          </button>

          <div className="text-center mt-3">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="text-center mt-3">
        <button
          onClick={() => navigate("/")}
          className="border border-gray-300 rounded-full text-gray-700 text-sm pr-4 pl-4 p-1 hover:bg-gray-100"
        >
          Back to Home ?
        </button>
        {/* /<p className="text-center mt-3 text-xs text-gray-400">
          Need Help Contact us now !
        </p>
        <p className="text-xs text-gray-600 mb-1 flex items-center">
          📧{" "}
          <a
            href="mailto:help@digiworldinfotech.com"
            className="text-blue-600 hover:underline ml-1"
          >
            help@digiworldinfotech.com
          </a>
        </p>
        <p className="text-xs text-gray-600 flex items-center">
          📞{" "}
          <a
            href="tel:+918830553868"
            className="text-blue-600 hover:underline ml-1"
          >
            +91 883 055 3868
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default LoginForm;
