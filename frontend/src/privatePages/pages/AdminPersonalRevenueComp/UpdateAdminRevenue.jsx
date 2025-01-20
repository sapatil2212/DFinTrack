import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UpdateAdminRevenue = ({
  onSubmit,
  initialValues,
  onCancel,
  revenueId,
}) => {
  const [adminId, setAdminId] = useState(null);
  const [revenueAmount, setRevenueAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.id) {
          setAdminId(decodedToken.id);
        } else {
          console.error("Token does not contain a valid 'id' property.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchRevenueAmount = async () => {
      if (revenueId) {
        try {
          const response = await axios.get(
            `/api/personal-revenues/${revenueId}`
          );
          setRevenueAmount(response.data.amount);
        } catch (error) {
          console.error("Error fetching revenue:", error);
        }
      }
    };

    fetchRevenueAmount();
  }, [revenueId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: initialValues?.amount || "",
      revenueType: initialValues?.revenueType || "",
      paymentMode: initialValues?.paymentMode || "",
      description: initialValues?.description || "",
      bank: initialValues?.bank || "",
    },
  });

  const handleUpdate = async (data) => {
    if (!adminId) {
      console.error("User ID is missing");
      return;
    }

    const updatedData = {
      ...data,
      adminId: adminId,
    };

    setIsProcessing(true);

    try {
      const success = await onSubmit(revenueId, updatedData);

      if (success) {
        setShowSuccessMessage(true);
        setSuccessMessage("Revenue updated successfully!");

        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            onCancel();
          }, 300);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating revenue:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      style={{ zIndex: 9999 }}
    >
      <div
        className={`bg-white rounded-lg p-6 w-full max-w-md transform transition-transform duration-300 ${
          isClosing ? "scale-95" : "scale-100"
        }`}
      >
        <h1 className="text-xl font-semibold mb-4">Update Revenue</h1>
        <hr className="border-t border-gray-200 mb-4" />

        {showSuccessMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 font-medium text-center">
              {successMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={revenueAmount || "Enter revenue amount"}
              {...register("amount", {
                required: "Amount is required",
                min: { value: 0.01, message: "Amount must be greater than 0" },
              })}
              disabled={isProcessing}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Mode
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                errors.paymentMode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Payment Mode"
              {...register("paymentMode", {
                required: "Payment mode is required",
              })}
              disabled={isProcessing}
            />
            {errors.paymentMode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.paymentMode.message}
              </p>
            )}
          </div>

          {/* Revenue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenue Type
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                errors.revenueType ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter revenue type"
              {...register("revenueType", {
                required: "Revenue type is required",
              })}
              disabled={isProcessing}
            />
            {errors.revenueType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.revenueType.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter description"
              {...register("description", {
                required: "Description is required",
                maxLength: {
                  value: 500,
                  message: "Description must be less than 500 characters",
                },
              })}
              disabled={isProcessing}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                errors.bank ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter bank name"
              {...register("bank", {
                required: "Bank is required",
              })}
              disabled={isProcessing}
            />
            {errors.bank && (
              <p className="mt-1 text-sm text-red-600">{errors.bank.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border rounded-md hover:bg-gray-100"
              onClick={handleCancel}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdminRevenue;
