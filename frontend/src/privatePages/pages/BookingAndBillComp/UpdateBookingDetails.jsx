import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateBooking } from "../../../slices/BookingSlice";
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

const UpdateBookingDetails = ({ booking, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [editedBooking, setEditedBooking] = useState(booking);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      await dispatch(updateBooking(editedBooking)).unwrap();
      setSuccessMessage("Booking details updated successfully!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError("Failed to update booking. Please try again.");
    }
  };

  const bookingFields = [
    { name: "guestName", label: "Guest Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phoneNo", label: "Phone Number", type: "tel" },
    { name: "checkInDate", label: "Check-In Date", type: "date" },
    { name: "checkOutDate", label: "Check-Out Date", type: "date" },
    { name: "roomNo", label: "Room Number", type: "text" },
    { name: "noOfGuests", label: "Number of Guests", type: "number" },
    { name: "noOfChildren", label: "Number of Children", type: "number" },
    { name: "companyName", label: "Company Name", type: "text" },
    { name: "documentSubmitted", label: "Document Submitted", type: "text" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white font-poppins">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Booking Details
          </DialogTitle>
        </DialogHeader>
        <hr className="w-full mt-2 border-t border-gray-300" />

        {error && (
          <Alert variant="destructive" className="bg-red-50 text-red">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert variant="success" className="bg-green-50 text-green">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {bookingFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                </Label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={editedBooking[field.name]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-gray-300"
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              Save Changes
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBookingDetails;
