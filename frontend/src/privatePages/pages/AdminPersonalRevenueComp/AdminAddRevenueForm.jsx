import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createRevenue } from "../../../slices/PersonalRevenueSlice";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
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

const AdminAddRevenueForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: "",
    revenueType: "PROPERTY",
    bank: "",
    paymentMode: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      const result = await dispatch(
        createRevenue({
          data: {
            ...formData,
            amount: parseFloat(formData.amount),
          },
          token,
        })
      ).unwrap();

      if (result && result.data) {
        setSuccess(true);
        // Close the modal immediately after success
        onSuccess();
        onClose();
      } else {
        throw new Error("Failed to create revenue");
      }
    } catch (error) {
      console.error("Error creating revenue:", error);
      setErrors({
        submit: error.message || "Failed to create revenue. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg font-poppins">
        <DialogHeader>
          <DialogTitle>Add New Revenue</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter the details of the new revenue entry.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600 ml-2">
              Revenue added successfully!
            </AlertDescription>
          </Alert>
        )}

        {errors.submit && (
          <Alert className="bg-red-50 border-red-200 mb-4">
            <AlertDescription className="text-red-600 ml-2">
              {errors.submit}
            </AlertDescription>
          </Alert>
        )}

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
              disabled={loading || success}
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
            <label className="text-sm font-medium" htmlFor="bank">
              Bank
            </label>
            <Input
              id="bank"
              required
              disabled={loading || success}
              value={formData.bank}
              onChange={(e) =>
                setFormData({ ...formData, bank: e.target.value })
              }
              className={errors.bank ? "border-red-500" : ""}
            />
            {errors.bank && (
              <p className="mt-2 text-sm text-red-600">{errors.bank}</p>
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
              disabled={loading || success}
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
              <p className="mt-2 text-sm text-red-600">{errors.paymentMode}</p>
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
              disabled={loading || success}
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || success}
              className={`${
                loading || success
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? "Adding..." : "Add Revenue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddRevenueForm;
