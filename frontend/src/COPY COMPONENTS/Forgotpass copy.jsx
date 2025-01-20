import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaKey,
  FaLock,
  FaSpinner,
} from "react-icons/fa";

const ForgotPass = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    securityKey: "",
    newPassword: "",
    oldPassword: "", // added field for old password
  });

  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    securityKey: "",
    newPassword: "",
    oldPassword: "",
  });

  const [loading, setLoading] = useState({
    sendOtp: false,
    verifyOtp: false,
    verifySecurityKey: false,
    resetPassword: false,
  });

  const [uiState, setUiState] = useState({
    isOtpSent: false,
    isSecurityKeyVerified: false,
    isOtpVerified: false,
    showSecurityKey: false,
    showNewPassword: false,
  });

  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:8080/users";

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email format";
    return "";
  };

  const validateOtp = (otp) => {
    if (!otp) return "OTP is required";
    if (otp.length !== 6) return "OTP must be 6 digits";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "New password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSendOtp = async () => {
    const emailError = validateEmail(formData.email);

    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    setLoading((prev) => ({ ...prev, sendOtp: true }));
    try {
      await axios.post(`${API_BASE_URL}/send-otp`, { email: formData.email });
      setUiState((prev) => ({ ...prev, isOtpSent: true }));
      setErrors({});
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email: error.response?.data?.message || "Email not found in database.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, sendOtp: false }));
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpError = validateOtp(formData.otp);

    if (otpError) {
      setErrors((prev) => ({ ...prev, otp: otpError }));
      return;
    }

    setLoading((prev) => ({ ...prev, verifyOtp: true }));
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.data) {
        setUiState((prev) => ({ ...prev, isOtpVerified: true }));
        setErrors({});
      } else {
        throw new Error("Invalid OTP.");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        otp: error.response?.data?.message || "Invalid OTP entered.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  const handleVerifySecurityKey = async () => {
    setLoading((prev) => ({ ...prev, verifySecurityKey: true }));
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-security-key`, {
        email: formData.email,
        securityKey: formData.securityKey,
      });

      if (response.status === 200) {
        setUiState((prev) => ({ ...prev, isSecurityKeyVerified: true }));
        setErrors({});
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        securityKey:
          error.response?.data?.message || "Invalid security key entered.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, verifySecurityKey: false }));
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(formData.newPassword);

    if (passwordError) {
      setErrors((prev) => ({ ...prev, newPassword: passwordError }));
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password must differ from old password.",
      }));
      return;
    }

    setLoading((prev) => ({ ...prev, resetPassword: true }));
    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        email: formData.email,
        newPassword: formData.newPassword,
      });
      navigate("/login");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        newPassword: error.response?.data?.message || "Password reset failed.",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, resetPassword: false }));
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
    const isPasswordType = name === "newPassword" || name === "securityKey";
    const showPasswordState = isPasswordType
      ? name === "securityKey"
        ? uiState.showSecurityKey
        : uiState.showNewPassword
      : false;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconComponent className="text-gray-400" />
          </div>
          <input
            type={showToggle && showPasswordState ? "text" : type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={`Enter your ${label.toLowerCase()}`}
            className={`pl-10 pr-10 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
              ${errors[name] ? "border-red-500" : "border-gray-300"}`}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() =>
                setUiState((prev) => ({
                  ...prev,
                  [name === "securityKey"
                    ? "showSecurityKey"
                    : "showNewPassword"]: !showPasswordState,
                }))
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPasswordState ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 font-['Poppins']">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        {!uiState.isOtpSent ? (
          <div>
            {renderInput("email", "Email", FaEnvelope)}
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
              disabled={loading.sendOtp}
            >
              {loading.sendOtp ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : null}
              Send OTP
            </button>
          </div>
        ) : !uiState.isOtpVerified ? (
          <form onSubmit={handleVerifyOtp}>
            {renderInput("otp", "OTP", FaKey)}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
              disabled={loading.verifyOtp}
            >
              {loading.verifyOtp ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : null}
              Verify OTP
            </button>
          </form>
        ) : !uiState.isSecurityKeyVerified ? (
          <div>
            {renderInput(
              "securityKey",
              "Security Key",
              FaKey,
              "password",
              true
            )}
            <button
              onClick={handleVerifySecurityKey}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
              disabled={loading.verifySecurityKey}
            >
              {loading.verifySecurityKey ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : null}
              Verify Security Key
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            {renderInput(
              "newPassword",
              "New Password",
              FaLock,
              "password",
              true
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
              disabled={loading.resetPassword}
            >
              {loading.resetPassword ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : null}
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
