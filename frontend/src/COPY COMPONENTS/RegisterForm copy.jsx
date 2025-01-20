import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

import {
  registerUser,
  loginCaretaker,
  checkEmailExists,
  validateSecurityKey,
} from "../services/UserService";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    accountType: "",
    name: "",
    email: "",
    securityKey: "",
    password: "",
    confirmPassword: "",
    propertyId: "",
  });
  const [properties, setProperties] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Fetch properties when accountType is USER
  useEffect(() => {
    if (formData.accountType === "USER") {
      fetch("http://localhost:8080/properties")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch properties");
          }
          return response.json();
        })
        .then((data) => setProperties(data))
        .catch(() => {
          setErrors((prev) => ({
            ...prev,
            properties: "Error fetching properties. Please try again.",
          }));
        });
    } else {
      setProperties([]);
    }
  }, [formData.accountType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStepOne = () => {
    const newErrors = {};
    if (!formData.accountType) {
      newErrors.accountType = "Please select an account type.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = async () => {
    const newErrors = {};

    // Name validation
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Please enter your name.";
    }

    // Email validation
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Please enter your email.";
    } else {
      try {
        setIsLoading(true);
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          newErrors.email = `User with email ${formData.email} already exists.`;
        }
      } catch (error) {
        console.error("Error checking email:", error);
        newErrors.email = "Error checking email. Please try again.";
      } finally {
        setIsLoading(false);
      }
    }

    // Security Key validation
    if (!formData.securityKey || formData.securityKey.trim() === "") {
      newErrors.securityKey = "Please enter the security key.";
    } else {
      try {
        setIsLoading(true);
        const isValidKey = await validateSecurityKey(formData.securityKey);
        if (!isValidKey) {
          newErrors.securityKey = "Invalid Security Key";
        }
      } catch (error) {
        console.error("Error validating security key:", error);
        newErrors.securityKey =
          "Error validating security key. Please try again.";
      } finally {
        setIsLoading(false);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepThree = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Please enter a password.";
    } else if (formData.password.length < 5 || formData.password.length > 15) {
      newErrors.password = "Password must be between 5 to 15 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepFour = () => {
    const newErrors = {};

    if (formData.accountType === "USER" && !formData.propertyId) {
      newErrors.propertyId = "Please select a property.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStepOne();
        break;
      case 2:
        isValid = await validateStepTwo();
        break;
      case 3:
        isValid = validateStepThree();
        break;
      case 4:
        isValid = validateStepFour();
        break;
      default:
        isValid = false;
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        propertyId:
          formData.accountType === "USER" ? formData.propertyId : null,
      };

      if (formData.accountType === "ADMIN") {
        await registerUser(payload);
      } else if (formData.accountType === "USER") {
        await loginCaretaker(payload);
      }

      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setErrors({ submit: backendMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Success Alert Component
  const SuccessAlert = () => (
    <div
      role="alert"
      className="fixed top-8 right-4 rounded-xl border border-gray-100 bg-white p-4 shadow-lg z-50 animate-bounce"
    >
      <div className="flex items-start gap-4">
        <span className="text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>

        <div className="flex-1">
          <strong className="block font-medium text-gray-900">
            Registration Successful
          </strong>
          <p className="mt-1 text-sm text-gray-700">
            You will be redirected to login shortly.
          </p>
        </div>
      </div>
    </div>
  );

  // Render input with error handling
  const renderInput = (name, label, type = "text", showToggle = false) => {
    const inputProps = {
      type:
        type === "password"
          ? showToggle &&
            (name === "password" ? showPassword : showConfirmPassword)
            ? "text"
            : "password"
          : type,
      name,
      value: formData[name],
      onChange: handleChange,
      className: `mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
        errors[name] ? "border-red-500" : "border-gray-300"
      }`,
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <input {...inputProps} />
          {showToggle && (
            <button
              type="button"
              onClick={() =>
                name === "password"
                  ? setShowPassword(!showPassword)
                  : setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {(name === "password" ? showPassword : showConfirmPassword) ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r  bg-gray-100 font-['Poppins']">
      {success && <SuccessAlert />}

      <div className="w-full max-w-lg bg-white rounded-xl shadow-sml border-gray-200 p-8 mt-10">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          {currentStep === 1 && "Sign up"}
          {currentStep === 2 && "Enter Your Details"}
          {currentStep === 3 && "Set Your Password"}
          {currentStep === 4 && "Confirm Details"}
        </h2>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 w-8 mx-1 rounded-full ${
                currentStep >= step ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Account Type */}
          {currentStep === 1 && (
            <div>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.accountType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Account Type</option>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              {errors.accountType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.accountType}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Personal and Security Information */}
          {currentStep === 2 && (
            <>
              {renderInput("name", "Name")}
              {renderInput("email", "Email", "email")}
              {renderInput("securityKey", "Security Key", "password")}
            </>
          )}

          {/* Step 3: Password */}
          {currentStep === 3 && (
            <>
              {renderInput("password", "Password", "password", true)}
              {renderInput(
                "confirmPassword",
                "Confirm Password",
                "password",
                true
              )}
            </>
          )}

          {/* Step 4: Confirmation for USER */}
          {currentStep === 4 && formData.accountType === "USER" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Property
              </label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                disabled={properties.length === 0}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.propertyId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  {properties.length === 0
                    ? "Loading properties..."
                    : "Select a Property"}
                </option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              {errors.propertyId && (
                <p className="text-red-500 text-xs mt-1">{errors.propertyId}</p>
              )}
            </div>
          )}

          {/* Global error message */}
          {errors.submit && (
            <p className="text-red-500 text-center text-sm mt-2 gap-x-4">
              {errors.submit}
            </p>
          )}

          <div className="flex justify-between items-center gap-x-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Back
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className={`w-full py-2 gap-3 px-4 bg-blue-500 text-white rounded-md flex items-center justify-center transition ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-4 bg-green-500 text-white rounded-md flex items-center justify-center transition ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-600"
                }`}
              >
                {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                Register
              </button>
            )}
          </div>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600 mb-7">
              Already Have an Account?{" "}
              <Link
                to="/login"
                className="text-blue-600 decoration-2 hover:underline font-medium"
              >
                Log in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
