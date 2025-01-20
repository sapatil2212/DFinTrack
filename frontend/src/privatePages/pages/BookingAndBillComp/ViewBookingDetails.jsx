import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearExistingBillError } from "../../../slices/BillSlice";
import { billService } from "../../../services/BillService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ExistingBillPopup from "../BookingAndBillComp/ExistingBillErrorPopupProps";
import CompleteBillDetails from "../BookingAndBillComp/ViewBillDetails";
import BillNotFoundPopup from "./BillNotFoundPopup";

const ViewBookingDetails = ({ open, onClose, booking }) => {
  const dispatch = useDispatch();
  const { existingBillError } = useSelector((state) => state.bills);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingBill, setExistingBill] = useState(null);
  const [showCompleteBillDetails, setShowCompleteBillDetails] = useState(false);
  const [showBillNotFoundPopup, setShowBillNotFoundPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    if (existingBillError) {
      setShowCompleteBillDetails(false);
    }
  }, [existingBillError]);

  const handleViewExistingBill = async () => {
    try {
      setIsLoading(true);
      const bill = await billService.getBillsByBookingId(booking.id);
      if (bill) {
        setExistingBill(bill);
        setShowCompleteBillDetails(true);
        dispatch(clearExistingBillError());
      } else {
        setShowBillNotFoundPopup(true);
      }
    } catch (error) {
      setError();
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  if (!booking) {
    return (
      <Alert variant="destructive">
        <AlertDescription>No booking details available.</AlertDescription>
      </Alert>
    );
  }

  const bookingDetails = [
    { label: "Booking ID", value: booking.id },
    { label: "Guest Name", value: booking.guestName },
    { label: "Email", value: booking.email },
    { label: "Company Name", value: booking.companyName || "N/A" },
    { label: "Phone Number", value: booking.phoneNo },
    { label: "Room Number", value: booking.roomNo },
    { label: "Check-In Date", value: booking.checkInDate },
    { label: "Check-Out Date", value: booking.checkOutDate },
    { label: "Number of Guests", value: booking.noOfGuests },
    { label: "Number of Children", value: booking.noOfChildren },
    { label: "Created By", value: booking.createdByUsername },
    {
      label: "Document Submitted",
      value: booking.documentSubmitted || "Not Submitted",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white font-poppins">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Booking Details
          </DialogTitle>
          <DialogDescription>
            View booking information and existing bills
          </DialogDescription>
        </DialogHeader>

        {/* Horizonal Line*/}
        <hr className="w-full  border-t border-gray-300" />

        {error && (
          <Alert
            variant="destructive"
            className="my-2 animate-in slide-in-from-top-5"
          >
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Error Popup for Missing Bill */}
        <Dialog
          open={showErrorPopup}
          onOpenChange={() => setShowErrorPopup(false)}
        >
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Bill Not Found
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                No bill has been generated for this booking yet.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end mt-4">
              <Button
                onClick={() => setShowErrorPopup(false)}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bill Not Found Popup */}
        <BillNotFoundPopup
          isOpen={showBillNotFoundPopup}
          onClose={() => setShowBillNotFoundPopup(false)}
        />

        {/* Booking Details Table */}

        <div className="overflow-x-auto py-2">
          <table className="min-w-full table-auto border-separate border-spacing-1">
            <thead></thead>
            <tbody>
              {bookingDetails.map((item, index) => (
                <tr key={item.label}>
                  <td className="px-2 py-1 text-xs font-medium text-gray-700  ">
                    {item.label}
                  </td>
                  <td className="px-2 py-1 text-xs text-gray-700">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Horizonal Line*/}
        <hr className="w-full  border-t border-gray-300" />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleViewExistingBill}
            disabled={isLoading}
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 "
          >
            View Bill
          </button>
        </div>

        {/* Existing Bill Popup */}
        <ExistingBillPopup
          isOpen={existingBillError}
          onClose={() => dispatch(clearExistingBillError())}
          onViewExistingBill={handleViewExistingBill}
        />

        {/* Complete Bill Details */}
        <CompleteBillDetails
          isOpen={showCompleteBillDetails}
          onClose={() => setShowCompleteBillDetails(false)}
          billDetails={existingBill}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewBookingDetails;
