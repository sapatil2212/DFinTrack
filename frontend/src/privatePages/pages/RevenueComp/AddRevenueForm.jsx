import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRevenue } from "../../../slices/RevenuSlice";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AddRevenueForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    paymentMode: "",
    source: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    amount: "",
    description: "",
    paymentMode: "",
    source: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { successMessage } = useSelector((state) => state.revenue);

  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {
      amount: "",
      description: "",
      paymentMode: "",
      source: "",
    };

    if (isNaN(formData.amount) || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount.";
      isValid = false;
    }
    if (!formData.source) {
      newErrors.source = "Source is required.";
      isValid = false;
    }
    if (!formData.paymentMode) {
      newErrors.paymentMode = "Payment mode is required.";
      isValid = false;
    }
    if (!formData.description) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrors((prev) => ({ ...prev, amount: "Token is missing." }));
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
      } catch (error) {
        setErrors((prev) => ({ ...prev, amount: "Failed to decode token." }));
        return;
      }

      const userId = decodedToken?.id;
      const propertyId = decodedToken?.propertyId;

      if (!userId || !propertyId) {
        setErrors((prev) => ({
          ...prev,
          amount: "User ID or Property ID is missing in the token.",
        }));
        return;
      }

      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        propertyId: parseInt(propertyId),
      };

      await dispatch(createRevenue({ data: payload, token }));
      setShowSuccessModal(true);
      onSuccess && onSuccess();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        amount: "Failed to create revenue. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: "",
      description: "",
      paymentMode: "",
      source: "",
    });
    setErrors({ amount: "", description: "", paymentMode: "", source: "" });
    onClose();
  };

  return (
    <>
      {showSuccessModal && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto">
            <MdCheckCircle className="text-green-500 text-4xl mx-auto" />
            <h3 className="text-xl font-semibold text-center">Success!</h3>
            <p className="text-center">Revenue added successfully.</p>
          </div>
        </div>
      )}

      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white shadow-lg font-poppins">
          <DialogHeader>
            <DialogTitle>Add New Revenue</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter the details of the new revenue entry.
            </DialogDescription>
          </DialogHeader>
          <hr className="border-t border-gray-200 " />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="amount">
                Amount
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="source">
                Source
              </label>
              <Input
                id="source"
                required
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className={errors.source ? "border-red-500" : ""}
              />
              {errors.source && (
                <p className="mt-2 text-sm text-red-600">{errors.source}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="paymentMode">
                Payment Mode
              </label>
              <Select
                value={formData.paymentMode}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Payment Mode" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMode && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.paymentMode}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="description">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 ">
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-800 text-white"
              >
                {loading ? "Adding..." : "Add Revenue"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddRevenueForm;
