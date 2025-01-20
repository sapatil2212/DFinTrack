import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaKey,
  FaLock,
  FaSpinner,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

const ForgotPass = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    securityKey: "",
    newPassword: "",
    oldPassword: "",
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
    successMessage: "",
  });

  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:8080/users";

  // Steps for the progress bar
  const steps = [
    "Enter Email",
    "Verify OTP",
    "Verify Security Key",
    "Reset Password",
  ];

  const currentStep = uiState.isOtpSent
    ? uiState.isOtpVerified
      ? uiState.isSecurityKeyVerified
        ? 3
        : 2
      : 1
    : 0;

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

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

  // Prevent going back after certain stages
  useEffect(() => {
    const handlePopState = (event) => {
      if (uiState.isOtpVerified) {
        event.preventDefault();
        navigate("/login");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [uiState.isOtpVerified, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const showSuccessMessage = (message) => {
    setUiState((prev) => ({ ...prev, successMessage: message }));
    setTimeout(() => {
      setUiState((prev) => ({ ...prev, successMessage: "" }));
    }, 3000);
  };

  const handleGoBack = () => {
    setFormData((prev) => ({ ...prev, email: "" }));
    setUiState((prev) => ({
      ...prev,
      isOtpSent: false,
      successMessage: "",
    }));
    setErrors({});
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
        showSuccessMessage("OTP Verified Successfully!");
        setTimeout(() => {
          setUiState((prev) => ({ ...prev, isOtpVerified: true }));
        }, 3000);
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
        showSuccessMessage("Security Key Verified Successfully!");
        setTimeout(() => {
          setUiState((prev) => ({ ...prev, isSecurityKeyVerified: true }));
        }, 3000);
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

      showSuccessMessage("Password Reset Successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          error.response?.data?.message ||
          "The new password cannot be the same as the current password ",
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
            className={`pl-10 pr-10 py-2 block w-full rounded-md border ${
              errors[name]
                ? "border-red-500"
                : "border-gray-300 focus:border-indigo-500"
            } focus:ring-indigo-500 sm:text-sm`}
          />
          {showToggle && (
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => {
                setUiState((prev) => ({
                  ...prev,
                  showSecurityKey:
                    name === "securityKey"
                      ? !prev.showSecurityKey
                      : prev.showSecurityKey,
                  showNewPassword:
                    name === "newPassword"
                      ? !prev.showNewPassword
                      : prev.showNewPassword,
                }));
              }}
            >
              {showPasswordState ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </div>
          )}
        </div>
        {errors[name] && (
          <p className="mt-1 text-red-500 text-xs">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        {/* Progress Bar */}
        <div className="relative mb-6">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div
              className="bg-indigo-600 flex flex-col text-center text-white justify-center"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            {steps.map((step, index) => (
              <span
                key={index}
                className={`${
                  currentStep === index ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {uiState.successMessage && (
          <div className="mb-6 text-green-600 font-medium flex items-center">
            <FaCheckCircle className="mr-2" />
            {uiState.successMessage}
          </div>
        )}

        {/* Render Dynamic Form */}
        {!uiState.isOtpSent ? (
          <>
            {renderInput("email", "Email Address", FaEnvelope)}
            <button
              onClick={handleSendOtp}
              disabled={loading.sendOtp}
              className={`w-full mt-2 bg-indigo-600 text-white py-2 rounded-md ${
                loading.sendOtp ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading.sendOtp ? (
                <FaSpinner className="animate-spin mx-auto" />
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        ) : uiState.isOtpSent && !uiState.isOtpVerified ? (
          <>
            {renderInput("otp", "OTP Code", FaKey)}
            <button
              onClick={handleVerifyOtp}
              disabled={loading.verifyOtp}
              className={`w-full mt-2 bg-indigo-600 text-white py-2 rounded-md ${
                loading.verifyOtp ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading.verifyOtp ? (
                <FaSpinner className="animate-spin mx-auto" />
              ) : (
                "Verify OTP"
              )}
            </button>
            <button
              onClick={handleGoBack}
              className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md"
            >
              <FaArrowLeft className="inline mr-2" />
              Back
            </button>
          </>
        ) : uiState.isOtpVerified && !uiState.isSecurityKeyVerified ? (
          <>
            {renderInput(
              "securityKey",
              "Security Key",
              FaLock,
              "password",
              true
            )}
            <button
              onClick={handleVerifySecurityKey}
              disabled={loading.verifySecurityKey}
              className={`w-full mt-2 bg-indigo-600 text-white py-2 rounded-md ${
                loading.verifySecurityKey ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading.verifySecurityKey ? (
                <FaSpinner className="animate-spin mx-auto" />
              ) : (
                "Verify Security Key"
              )}
            </button>
          </>
        ) : (
          <>
            {renderInput(
              "newPassword",
              "New Password",
              FaLock,
              "password",
              true
            )}
            <button
              onClick={handleResetPassword}
              disabled={loading.resetPassword}
              className={`w-full mt-2 bg-indigo-600 text-white py-2 rounded-md ${
                loading.resetPassword ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading.resetPassword ? (
                <FaSpinner className="animate-spin mx-auto" />
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
