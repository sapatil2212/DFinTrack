import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRevenue } from "../../../slices/RevenuSlice";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const CreateRevenueForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.revenue);
  const [formData, setFormData] = useState({
    amount: "",
    type: "Rent",
    paymentMode: "Bank Transfer",
    source: "Property",
    description: "", // Add description to the form state
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    const revenueData = {
      data: {
        amount: parseFloat(formData.amount),
        type: formData.type,
        paymentMode: formData.paymentMode,
        source: formData.source,
        description: formData.description, // Include description in the payload
      },
      token,
    };

    try {
      await dispatch(createRevenue(revenueData)).unwrap();
      setFormData({
        amount: "",
        type: "Rent",
        paymentMode: "Bank Transfer",
        source: "Property",
        description: "", // Reset the description field
      });
      toast.success("Revenue created successfully!");
    } catch (err) {
      console.error("Failed to create revenue:", err);
      toast.error("Failed to create revenue. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to Create Revenue</AlertTitle>
            <AlertDescription>
              {typeof error === "string"
                ? error
                : "An error occurred while creating revenue"}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleInputChange}
              required
              placeholder="Enter amount"
              className="w-full"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Type
            </label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Deposit">Deposit</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentMode" className="text-sm font-medium">
              Payment Mode
            </label>
            <Select
              name="paymentMode"
              value={formData.paymentMode}
              onValueChange={(value) =>
                handleSelectChange("paymentMode", value)
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Source
            </label>
            <Select
              name="source"
              value={formData.source}
              onValueChange={(value) => handleSelectChange("source", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Property">Property</SelectItem>
                <SelectItem value="Tenant">Tenant</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add description field */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter a description"
              className="w-full"
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Revenue...
              </>
            ) : (
              "Create Revenue"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateRevenueForm;
