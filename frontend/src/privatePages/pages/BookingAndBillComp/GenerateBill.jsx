import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBill } from "../../../slices/BillSlice";
import { jwtDecode } from "jwt-decode";
import { X, ChevronRight } from "lucide-react";
import ViewBillDetails from "./ViewBillDetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GenerateBillModal = ({ isOpen, onClose, booking }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [generatedBillDetails, setGeneratedBillDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setModeOfPayment("");
      setError("");
      setSuccess("");
      setIsSubmitting(false);
      setShowBillDetails(false);
      setGeneratedBillDetails(null);
    }
  }, [isOpen]);

  const calculateTax = (amount) => {
    const cgst = amount * 0.12;
    const sgst = amount * 0.12;
    const totalAmount = amount + cgst + sgst;
    return { cgst, sgst, totalAmount };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!amount || !modeOfPayment) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    const amountValue = parseFloat(amount);
    const { cgst, sgst, totalAmount } = calculateTax(amountValue);

    try {
      const response = await dispatch(
        createBill({
          bookingId: booking.id,
          amount: amountValue,
          totalAmount,
          cgst,
          sgst,
          modeOfPayment,
          userId,
        })
      ).unwrap();

      // Set the generated bill details
      setGeneratedBillDetails({
        ...response,
        bookingDetails: booking,
        propertyName: booking.propertyName,
        invoiceNumber: response.id,
      });

      setSuccess("Bill generated successfully!");
    } catch (error) {
      if (error.existingBillError) {
        setError("Bill already generated for this booking!");
      } else {
        setError("Failed to generate bill. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleViewBill = () => {
    setShowBillDetails(true);
  };

  const handleCloseBillDetails = () => {
    setShowBillDetails(false);
    onClose();
  };

  if (showBillDetails) {
    return (
      <ViewBillDetails
        isOpen={showBillDetails}
        onClose={handleCloseBillDetails}
        billDetails={generatedBillDetails}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white sm:max-w-[500px] font-poppins">
        <DialogHeader>
          <DialogTitle>Generate Bill</DialogTitle>
        </DialogHeader>

        {/* Show success message */}
        {success && (
          <Alert variant="success" className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Show error message */}
        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 ">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bookingId" className="text-left">
                Booking ID
              </Label>
              <Input
                id="bookingId"
                value={booking.id}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guestName" className="text-left">
                Guest Name
              </Label>
              <Input
                id="guestName"
                value={booking.guestName}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-left">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
                placeholder="Enter amount"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* CGST */}
              <div className="flex items-center gap-2">
                <Label htmlFor="cgst" className="w-full text-left">
                  CGST (12%)
                </Label>
                <Input
                  id="cgst"
                  value={amount ? (parseFloat(amount) * 0.12).toFixed(2) : ""}
                  className="w-full"
                  readOnly
                />
              </div>

              {/* SGST */}
              <div className="flex items-center gap-2">
                <Label htmlFor="sgst" className="w-full text-left">
                  SGST (12%)
                </Label>
                <Input
                  id="sgst"
                  value={amount ? (parseFloat(amount) * 0.12).toFixed(2) : ""}
                  className="w-full"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalAmount" className="text-left">
                Total Amount
              </Label>
              <Input
                id="totalAmount"
                value={amount ? (parseFloat(amount) * 1.18).toFixed(2) : ""}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modeOfPayment" className="text-left">
                Payment Mode
              </Label>
              <Select
                onValueChange={setModeOfPayment}
                value={modeOfPayment}
                disabled={isSubmitting}
              >
                <SelectTrigger className="col-span-3 p-4">
                  <SelectValue placeholder="Select payment mode " />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="UPI">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            {/* Show clickable text when the bill is generated */}
            {success ? (
              <button
                type="button"
                onClick={handleViewBill}
                className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-blue-600 hover:underline"
              >
                View Bill <ChevronRight />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-neutral-50 ml-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                >
                  {isSubmitting ? "Generating..." : "Generate Bill & Check-Out"}
                </button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateBillModal;
