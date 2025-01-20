import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, FileIcon, X, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ViewBillDetails = ({ isOpen, onClose, billDetails }) => {
  const [showExportDialog, setShowExportDialog] = useState(false);

  if (!billDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto mx-auto bg-white">
          <div className="py-4">
            <p className="text-center text-gray-600">
              No bill details available
            </p>
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto mx-auto bg-white font-poppins">
        <Card className="border-0 shadow-none bg-white">
          <div id="bill-format" className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text">
                  Zenith
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-sm text-gray-500">
                  <div>Invoice #{billDetails.invoiceNumber}</div>
                  <div>
                    {new Date(billDetails.billDateTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex justify-center items-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-blue-700 text-sm font-medium">
                  Digital Invoice
                </span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Guest Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Guest Name:</span>
                    <span className="font-medium ml-2">
                      {billDetails.bookingDetails.guestName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Contact:</span>
                    <span className="font-medium ml-2">
                      {billDetails.bookingDetails.phoneNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium ml-2">
                      {billDetails.bookingDetails.email}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Stay Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Check-in:</span>
                    <span className="font-medium ml-2">
                      {billDetails.bookingDetails.checkInDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Check-out:</span>
                    <span className="font-medium ml-2">
                      {billDetails.bookingDetails.checkOutDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Room:</span>
                    <span className="font-medium ml-2">
                      {billDetails.bookingDetails.roomNo}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charges Breakdown */}
            <div className="mb-8 bg-gray-50 border rounded-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Charges Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ChargeRow
                    label="Room Charges"
                    amount={billDetails.amount}
                    description="Base room charges for the stay"
                  />
                  <ChargeRow
                    label="SGST (12%)"
                    amount={billDetails.sgst}
                    description="State GST"
                  />
                  <ChargeRow
                    label="CGST (12%)"
                    amount={billDetails.cgst}
                    description="Central GST"
                  />
                  <Separator className="my-4" />
                  <ChargeRow
                    label="Total Amount"
                    amount={billDetails.totalAmount}
                    isTotal
                  />
                </div>
              </CardContent>
            </div>

            {/* Additional Details */}
            <div className="text-sm text-gray-600 space-y-2 mb-8">
              <div>
                <span className="font-medium">Payment Method:</span>
                <span className="ml-2">{billDetails.modeOfPayment}</span>
              </div>
              <div>
                <span className="font-medium">Booking ID:</span>
                <span className="ml-2">{billDetails.bookingId}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  This is a computer-generated document. No signature required.
                </div>
                <div className="flex gap-3">
                  <button
                    variant="outline"
                    onClick={() => window.print()}
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-900 hover:border-blue-600 hover:text-blue-600 focus:outline-none focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none "
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={onClose}
                    variant="destructive"
                    className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-900 hover:border-blue-600 hover:text-blue-600 focus:outline-none focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none "
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

const ChargeRow = ({ label, amount, description, isTotal = false }) => (
  <div className="flex justify-between items-center">
    <div>
      <div
        className={`${
          isTotal ? "font-semibold text-lg" : "font-medium"
        } text-gray-900`}
      >
        {label}
      </div>
      {description && (
        <div className="text-sm text-gray-500">{description}</div>
      )}
    </div>
    <div
      className={`${
        isTotal ? "font-semibold text-lg" : "font-medium"
      } text-gray-900`}
    >
      ₹{amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
    </div>
  </div>
);

export default ViewBillDetails;
